import { NextRequest, NextResponse } from "next/server";
import client, { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "karnel-travels-refresh-secret-key";

// Rate limiting - In production, use Redis
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

export async function POST(request: NextRequest) {
  let db;
  try {
    await client.connect();
    db = getDb();
    
    const body = await request.json();
    const { email, password } = body;

    // ============ Input Validation ============
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // ============ Rate Limiting ============
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    const attemptKey = `${clientIP}:${email}`;
    const now = Date.now();
    
    const attempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
    
    // Reset after 15 minutes
    if (now - attempts.lastAttempt > 15 * 60 * 1000) {
      attempts.count = 0;
    }
    
    if (attempts.count >= 5) {
      return NextResponse.json(
        { success: false, message: "Quá nhiều lần thử. Vui lòng thử lại sau 15 phút." },
        { status: 429 }
      );
    }

    const usersCollection = db.collection("users");
    
    // ============ Find User ============
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Record failed attempt
      attempts.count++;
      attempts.lastAttempt = now;
      loginAttempts.set(attemptKey, attempts);
      
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // ============ Check Account Status ============
    if (user.status === "inactive") {
      return NextResponse.json(
        { success: false, message: "Tài khoản đã bị vô hiệu hóa. Vui liên hệ hỗ trợ." },
        { status: 403 }
      );
    }

    // ============ Verify Password ============
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: "Tài khoản này đăng nhập bằng mạng xã hội. Vui lòng sử dụng đăng nhập Google/Facebook." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // Record failed attempt
      attempts.count++;
      attempts.lastAttempt = now;
      loginAttempts.set(attemptKey, attempts);
      
      return NextResponse.json(
        { success: false, message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    // ============ Clear Rate Limit on Success ============
    loginAttempts.delete(attemptKey);

    // ============ Generate Tokens ============
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" } // Short-lived access token
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // ============ Update User Data ============
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          lastLogin: new Date().toISOString(),
          refreshToken 
        } 
      }
    );

    // ============ Create Response ============
    const response = NextResponse.json(
      {
        success: true,
        message: "Đăng nhập thành công",
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
          },
          accessToken,
          refreshToken,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookies
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
