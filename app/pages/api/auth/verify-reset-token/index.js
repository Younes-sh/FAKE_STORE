// pages/api/auth/verify-reset-token.js
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, token } = req.body;

  try {
    await dbConnect();

    // پیدا کردن کاربر با ایمیل و توکن معتبر
    // از select استفاده نمی‌کنیم چون فیلدها select:false هستند
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: token.trim(),
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.status(200).json({ message: 'Token is valid' });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}