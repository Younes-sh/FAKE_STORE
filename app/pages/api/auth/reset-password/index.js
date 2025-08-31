// pages/api/auth/reset-password.js
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token, newPassword } = req.body;

  // اعتبارسنجی داده‌های ورودی
  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    await dbConnect();

    // پیدا کردن کاربر با توکن معتبر
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: token.trim(),
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // هش کردن پسورد جدید قبل از ذخیره
    const hashedPassword = await hash(newPassword, 12);

    // آپدیت کاربر
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}