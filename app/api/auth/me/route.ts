import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client, { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";

/**
 * Extract token from cookie or Authorization header
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Try to get from cookie first
  const accessToken = request.cookies.get("access_token")?.value;
  if (accessToken) return accessToken;

  // Try to get from Authorization header
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(request: NextRequest) {
  let db;
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy token xác thực" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    // Get user from database
    await client.connect();
    db = getDb();

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0, refreshToken: 0, resetPasswordToken: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Người dùng không tồn tại" },
        { status: 404 }
      );
    }

    // Check if user is active
    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị vô hiệu hóa" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            provider: user.provider,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
          },
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get current user error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
