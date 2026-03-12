import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client, { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "karnel-travels-refresh-secret-key";

/**
 * POST /api/auth/refresh-token
 * Refresh access token using refresh token
 */
export async function POST(request: NextRequest) {
  let db;
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token là bắt buộc" },
        { status: 400 }
      );
    }

    // Verify refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Refresh token không hợp lệ hoặc đã hết hạn" },
        { status: 401 }
      );
    }

    // Connect to database
    await client.connect();
    db = getDb();

    const usersCollection = db.collection("users");

    // Verify refresh token in database (for token rotation)
    const user = await usersCollection.findOne({
      _id: new ObjectId(decoded.userId),
      refreshToken: refreshToken,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Refresh token không hợp lệ" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị vô hiệu hóa" },
        { status: 403 }
      );
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Optionally rotate refresh token (generate new one)
    const newRefreshToken = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Update refresh token in database
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { refreshToken: newRefreshToken } }
    );

    const response = NextResponse.json(
      {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      },
      { status: 200 }
    );

    // Set new cookies
    response.cookies.set("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
