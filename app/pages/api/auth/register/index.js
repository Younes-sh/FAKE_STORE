// pages/api/auth/register.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { hash as bcryptHash } from "bcryptjs";
import { sendVerificationCode } from "@/lib/mailer";
import { generate6DigitCode } from "@/lib/verifyCode";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { username, email, password } = req.body;

  // بررسی اعتبار اولیه ورودی‌ها
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6 ||
    !username ||
    username.trim().length < 3
  ) {
    return res.status(422).json({
      message: "Invalid input. Password must be at least 6 characters.",
    });
  }

  try {
    await dbConnect();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).select('+verificationCodeHash +verificationExpires');
    if (existingUser) return res.status(422).json({ message: "این ایمیل یا نام‌کاربری قبلاً ثبت شده است." });

    const newUser = new User({ username, email, password });

    const code = generate6DigitCode();
    const hash = await bcryptHash(code, 10);      // ✅ حالا تعریف شده
    newUser.verificationCodeHash = hash;
    newUser.verificationExpires = new Date(Date.now() + 15 * 60 * 1000);

    await newUser.save();
    await sendVerificationCode({ to: email, code });

    return res.status(201).json({
      message: "کاربر ایجاد شد. کُد تأیید به ایمیل ارسال شد.",
      email,
      next: `/verify?email=${encodeURIComponent(email)}`
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

