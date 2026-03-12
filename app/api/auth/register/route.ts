import { NextRequest, NextResponse } from "next/server";
import client, { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "karnel-travels-refresh-secret-key";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let db;
  try {
    await client.connect();
    db = getDb();
    
    const body = await request.json();
    const { name, email, password, phone } = body;

    // ============ Input Validation ============
    const errors: string[] = [];

    if (!name || name.trim().length < 2) {
      errors.push("Tên phải có ít nhất 2 ký tự");
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      errors.push("Email không hợp lệ");
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");
    
    // ============ Check for Existing User ============
    // Check duplicate email
    const existingEmail = await usersCollection.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Check duplicate phone (if provided)
    if (phone) {
      const existingPhone = await usersCollection.findOne({ phone });
      if (existingPhone) {
        return NextResponse.json(
          { success: false, message: "Số điện thoại đã được sử dụng" },
          { status: 409 }
        );
      }
    }

    // ============ Hash Password ============
    // Using bcrypt with salt rounds = 12 (balance between security and performance)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ============ Generate Verification Token ============
    const verificationToken = randomBytes(32).toString("hex");
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // ============ Create New User ============
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || "",
      role: "user", // Default role for new registrations
      status: "active",
      avatar: "",
      provider: "traditional",
      providerId: null,
      isEmailVerified: false,
      verificationToken,
      verificationExpires,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    const result = await usersCollection.insertOne(newUser);

    // ============ Generate Tokens ============
    const accessToken = jwt.sign(
      {
        userId: result.insertedId.toString(),
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: "15m" } // Short-lived access token
    );

    const refreshToken = jwt.sign(
      {
        userId: result.insertedId.toString(),
      },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Store refresh token in database (for token rotation)
    await usersCollection.updateOne(
      { _id: result.insertedId },
      { $set: { refreshToken } }
    );

    // TODO: Send verification email here
    // await sendVerificationEmail(newUser.email, verificationToken);

    const response = NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
        data: {
          user: {
            id: result.insertedId.toString(),
            email: newUser.email,
            name: newUser.name,
          },
          accessToken,
          refreshToken,
        },
      },
      { status: 201 }
    );

    // Set cookies
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra trong quá trình đăng ký" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
