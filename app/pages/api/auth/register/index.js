// pages/api/auth/register.js

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

    // بررسی وجود ایمیل تکراری
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(422).json({ message: "This email is already registered" });
    }

    // هش کردن پسورد
    const hashedPassword = await hash(password, 12);

    // ایجاد کاربر جدید
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
