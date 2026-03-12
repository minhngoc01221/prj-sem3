import { NextRequest, NextResponse } from "next/server";
import client, { getDb } from "@/lib/mongodb";
import { randomBytes } from "crypto";

// Rate limiting for forgot password
const forgotPasswordAttempts = new Map<string, { count: number; lastAttempt: number }>();

// In production, integrate with email service (SendGrid, Resend, AWS SES, etc.)
async function sendResetPasswordEmail(email: string, resetToken: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;
  
  // TODO: Integrate with email service
  // Example with SendGrid:
  // const msg = {
  //   to: email,
  //   from: 'noreply@karneltravels.com',
  //   subject: 'Đặt lại mật khẩu - Karnel Travels',
  //   html: `<p>Nhấp vào link sau để đặt lại mật khẩu: <a href="${resetUrl}">${resetUrl}</a></p>`,
  // };
  // await sgMail.send(msg);
  
  console.log(`[EMAIL] Reset password link sent to ${email}: ${resetUrl}`);
  return true;
}

export async function POST(request: NextRequest) {
  let db;
  try {
    await client.connect();
    db = getDb();
    
    const body = await request.json();
    const { email } = body;

    // ============ Input Validation ============
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // ============ Rate Limiting ============
    const clientIP = request.headers.get("x-forwarded-for") || "unknown";
    const attemptKey = `${clientIP}:${email}`;
    const now = Date.now();
    
    const attempts = forgotPasswordAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
    
    // Reset after 1 hour
    if (now - attempts.lastAttempt > 60 * 60 * 1000) {
      attempts.count = 0;
    }
    
    if (attempts.count >= 3) {
      return NextResponse.json(
        { success: false, message: "Quá nhiều lần yêu cầu. Vui lòng thử lại sau 1 giờ." },
        { status: 429 }
      );
    }

    const usersCollection = db.collection("users");
    
    // ============ Check if User Exists ============
    const user = await usersCollection.findOne({ email: email.toLowerCase() });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu." 
        },
        { status: 200 }
      );
    }

    // ============ Check if User Uses Social Login ============
    if (user.provider && user.provider !== "traditional") {
      return NextResponse.json(
        { 
          success: true, 
          message: "Tài khoản này đăng nhập bằng mạng xã hội. Vui lòng sử dụng đăng nhập Google/Facebook." 
        },
        { status: 200 }
      );
    }

    // ============ Generate Reset Token ============
    const resetToken = randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // ============ Save Reset Token to Database ============
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpires,
        } 
      }
    );

    // ============ Send Reset Email ============
    await sendResetPasswordEmail(email, resetToken);

    // Record attempt
    attempts.count++;
    attempts.lastAttempt = now;
    forgotPasswordAttempts.set(attemptKey, attempts);

    return NextResponse.json(
      { 
        success: true, 
        message: "Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
