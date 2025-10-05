// pages/api/auth/reset-password.js
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token, newPassword } = req.body;

  // console.log("📨 Request data:", {
  //   email: email,
  //   token: token ? `${token.substring(0, 10)}...` : 'missing',
  //   newPassword: newPassword ? `*** (${newPassword.length} chars)` : 'missing'
  // });

  try {
    await dbConnect();
    console.log("✅ Database connected");

    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim();

    console.log("🔍 Searching for user with token...");
    
    const user = await User.findOne({
      email: cleanEmail,
      resetPasswordToken: cleanToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    console.log("👤 User found:", user ? "YES" : "NO");

    if (!user) {
      console.log("❌ No valid user found with this token");
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    console.log("🔑 Hashing new password...");
    const hashedPassword = await hash(newPassword, 12);
    console.log("✅ Password hashed successfully");

    // 🔥 راه حل: استفاده از updateOne برای دور زدن hookهای save
    console.log("📝 Updating user with updateOne (bypassing hooks)...");
    
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword, // همین هش کافی است
          emailVerified: new Date(),
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
          verificationCodeHash: undefined,
          verificationExpires: undefined,
          verificationAttempts: 0
        }
      }
    );

    console.log("💾 User updated successfully");

    // تأیید نهایی
    const finalUser = await User.findById(user._id).select('+password');
    console.log("🔍 Final check - password set:", !!finalUser.password);
    
    // تست مقایسه پسورد
    const bcrypt = await import('bcryptjs');
    const isValid = await bcrypt.compare(newPassword, finalUser.password);
    console.log("🔑 Password verification test:", isValid);

    console.log("✅ Reset password completed for:", cleanEmail);

    res.status(200).json({ 
      message: 'Password reset successfully. You can now login with your new password.' 
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}