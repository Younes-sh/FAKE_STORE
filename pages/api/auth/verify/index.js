// pages/api/auth/verify.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

  try {
    await dbConnect();

    // با فیلدهای حساس
    const user = await User.findOne({ email }).select('+verificationCodeHash +verificationExpires +verificationAttempts');
    if (!user) return res.status(404).json({ message: "User not found" });

    // چک انقضا
    if (!user.verificationExpires || user.verificationExpires < new Date()) {
      return res.status(410).json({ message: "The code has expired. Request a resend." });
    }

    // محدودیت تلاش (دلخواه)
    if (user.verificationAttempts >= 5) {
      return res.status(429).json({ message: "Too many attempts. Please try again later." });
    }

    const ok = await bcrypt.compare(code, user.verificationCodeHash || "");
    if (!ok) {
      user.verificationAttempts += 1;
      await user.save();
      return res.status(401).json({ message: "Invalid code." });
    }

    // موفق: تأیید ایمیل - Successful: Email verification
    user.emailVerified = new Date();
    user.verificationCodeHash = undefined;
    user.verificationExpires = undefined;
    user.verificationAttempts = 0;
    await user.save();

    return res.status(200).json({ message: "Email successfully verified." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
