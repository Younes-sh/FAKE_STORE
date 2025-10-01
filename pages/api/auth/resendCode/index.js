// pages/api/auth/resendCode.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { sendVerificationCode } from "@/lib/mailer";
import { generate6DigitCode } from "@/lib/verifyCode";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await dbConnect();
    const user = await User.findOne({ email }).select('+verificationExpires');
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.emailVerified) return res.status(400).json({ message: "قبلاً تأیید شده است." });

    // rate limit ساده: حداقل 60 ثانیه بین ارسال‌ها
    const now = Date.now();
    const canResendAt = user._resendAt?.getTime?.() || 0;
    if (now - canResendAt < 60 * 1000) {
      const wait = Math.ceil((60 * 1000 - (now - canResendAt)) / 1000);
      return res.status(429).json({ message: `Please wait ${wait} seconds.` });
    }

    const code = generate6DigitCode();
    user.verificationCodeHash = await bcrypt.hash(code, 10);
    user.verificationExpires = new Date(now + 15 * 60 * 1000);
    user.verificationAttempts = 0;
    // فیلد کمکی بدون schema (mongoose ذخیره می‌کند)
    user._resendAt = new Date(now);
    await user.save();

    await sendVerificationCode({ to: email, code });
    return res.status(200).json({ message: "New code sent." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
