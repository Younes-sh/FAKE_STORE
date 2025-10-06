// pages/api/auth/forgotPassword.js
import { sendResetPasswordEmail } from '@/lib/mailer'; // ✅ این خط باید باشد
import { generate6DigitCode } from '@/lib/verifyCode';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Request body:', req.body);
  
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  if (typeof email !== 'string' || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  try {
    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(200).json({ 
        message: 'If the email exists, a password reset link has been sent' 
      });
    }

    const resetToken = generate6DigitCode();
    const resetTokenExpiry = Date.now() + 3600000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    await sendResetPasswordEmail({
      to: email,
      resetToken: resetToken,
      resetUrl: resetUrl
    });

    console.log('✅ Reset password email sent successfully');
    res.status(200).json({ 
      message: 'Password reset email sent successfully' 
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}