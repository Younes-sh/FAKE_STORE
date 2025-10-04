// pages/api/auth/register.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationCode } from "@/lib/mailer";
import { generate6DigitCode } from "@/lib/verifyCode";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, email, password } = req.body;

  // console.log("📝 Registration attempt:", { username, email });

  try {
    await dbConnect();
    // console.log("✅ Database connected");

    // بررسی وجود کاربر
    const existingUser = await User.findOne({ 
      $or: [
        { email: email.toLowerCase() }, 
        { username: username.trim() }
      ] 
    });
    
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(422).json({ 
        message: "This email or username is already registered." 
      });
    }

    // ایجاد کاربر جدید
    const newUser = new User({ 
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password 
    });

    // تولید کد تأیید
    const code = generate6DigitCode();
    console.log("🔑 Generated code:", code);
    
    const hash = await bcrypt.hash(code, 10);
    
    newUser.verificationCodeHash = hash;
    newUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    await newUser.save();
    console.log("✅ User saved to database");

    // ارسال ایمیل
    try {
      await sendVerificationCode({ to: email, code });
      console.log("✅ Verification email sent");
      
      return res.status(201).json({
        message: "User created. Verification code sent to email.",
        email: email.toLowerCase(),
        next: `/verify?email=${encodeURIComponent(email.toLowerCase())}`
      });
      
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      
      // حذف کاربر اگر ایمیل ارسال نشد
      await User.findByIdAndDelete(newUser._id);
      
      return res.status(500).json({ 
        message: "Error sending email. Please try again." 
      });
    }

  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ 
      message: "Server error. Please try again later." 
    });
  }
}