import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";

/**
 * Verify admin token from request
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  error?: string;
}> {
  try {
    // Try to get token from cookie first
    let token = request.cookies.get("access_token")?.value;

    // Also check admin_token cookie
    if (!token) {
      token = request.cookies.get("admin_token")?.value;
    }

    // Try Authorization header
    if (!token) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { success: false, error: "Không tìm thấy token xác thực" };
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return { success: false, error: "Token không hợp lệ hoặc đã hết hạn" };
    }

    // Check if user is admin or staff
    if (decoded.role !== "admin" && decoded.role !== "staff") {
      return { success: false, error: "Bạn không có quyền truy cập" };
    }

    // Get user from database to verify status
    const db = await getDb();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0, refreshToken: 0 } }
    );

    if (!user) {
      return { success: false, error: "Người dùng không tồn tại" };
    }

    if (user.status === "inactive") {
      return { success: false, error: "Tài khoản đã bị vô hiệu hóa" };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false, error: "Có lỗi xảy ra khi xác thực" };
  }
}

/**
 * Higher-order function to protect admin routes
 */
export function withAuth(
  handler: (request: NextRequest, ...args: any[]) => Promise<NextResponse>,
  requireAdmin: boolean = true
) {
  return async function (request: NextRequest, ...args: any[]) {
    const authResult = await verifyAdminAuth(request);

    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    // If requireAdmin is true, check for admin role
    if (requireAdmin && authResult.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Chỉ admin mới có quyền thực hiện thao tác này" },
        { status: 403 }
      );
    }

    // Add user info to request for use in handler
    (request as any).user = authResult.user;

    return handler(request, ...args);
  };
}
