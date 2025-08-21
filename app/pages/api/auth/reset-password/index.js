// pages/api/auth/reset-password.js
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { hash } from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token, newPassword } = req.body;

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


    // آپدیت کاربر
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}