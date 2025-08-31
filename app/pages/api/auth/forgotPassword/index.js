// pages/api/auth/forgotPassword.js
import { transporter } from '@/lib/mailer';
import { generate6DigitCode } from '@/lib/verifyCode';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';
import { generateEmailTemplate } from '@/Components/EmailTemplate'; // Import the template

export default async function handler(req, res) {
   // اضافه کردن headers برای CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // اعتبارسنجی body
  console.log('Request body:', req.body);
  
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is required' });
  }

  const { email } = req.body;

  // اعتبارسنجی ایمیل
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
      // برای امنیت، همیشه پیام موفقیت آمیز برگردانید
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
    // const resetUrl = `${baseUrl}/reset-password`;
    const resetUrl = `/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // ارسال ایمیل
    // درون تابع handler:
    const emailHtml = generateEmailTemplate(resetToken, resetUrl);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: emailHtml
    });
    res.status(200).json({ 
      message: 'Password reset email sent successfully' 
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}