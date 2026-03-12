import { NextRequest, NextResponse } from "next/server";
import client, { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(request: NextRequest) {
  let db;
  try {
    await client.connect();
    db = getDb();
    
    const body = await request.json();
    const { token, newPassword } = body;

    // ============ Input Validation ============
    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Token và mật khẩu mới là bắt buộc" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(newPassword)) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt" 
        },
        { status: 400 }
      );
    }

    const usersCollection = db.collection("users");
    
    // ============ Find User with Valid Token ============
    const user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // ============ Check if it's the same as old password ============
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu mới phải khác mật khẩu cũ" },
        { status: 400 }
      );
    }

    // ============ Hash New Password ============
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // ============ Update Password ============
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
          lastPasswordChanged: new Date().toISOString(),
        },
        $unset: {
          refreshToken: "" // Force re-login on all devices
        }
      }
    );

    // TODO: Send confirmation email
    // await sendPasswordChangedEmail(user.email);

    return NextResponse.json(
      { 
        success: true, 
        message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
