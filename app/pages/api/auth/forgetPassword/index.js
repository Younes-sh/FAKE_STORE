// pages/api/auth/forgotPassword.js
import { transporter } from '@/lib/mailer';
import { generate6DigitCode } from '@/lib/verifyCode';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    await dbConnect();

    // بررسی وجود کاربر در دیتابیس
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ error: 'User with this email address was not found.' });
    }

    // تولید توکن بازنشانی
    const resetToken = generate6DigitCode();
    const resetTokenExpiry = Date.now() + 3600000; // 1 ساعت اعتبار

    // ذخیره توکن در دیتابیس
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // ایجاد URL برای صفحه reset-password
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`;

    // ارسال ایمیل با دکمه
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #eee;">
          <div style="background: linear-gradient(135deg, #805ad5, #6b46c1); color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 22px;">Password Reset Request</h2>
          </div>
          
          <div style="padding: 25px; color: #333;">
            <p style="font-size: 16px; margin-bottom: 12px;">Hello,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">You requested to reset your password. Your verification code is:</p>
            
            <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f9f9f9; padding: 15px 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; border: 1px dashed #805ad5;">
              ${resetToken}
            </div>
            
            <p style="font-size: 14px; color: #666; margin-bottom: 25px; text-align: center;">
              This code is valid for <b>1 hour</b>. Enter it on the password reset page.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #805ad5, #6b46c1); 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: 600; 
                        font-size: 16px; 
                        display: inline-block;
                        transition: all 0.3s ease;">
                Reset Your Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; text-align: center; margin-bottom: 10px;">
              Or copy and paste this URL in your browser:
            </p>
            <p style="font-size: 12px; color: #805ad5; text-align: center; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #777;">
            <p style="margin: 0;">If you didn't request this password reset, please ignore this email.</p>
            <p style="margin: 5px 0 0 0;">Your account security is important to us.</p>
          </div>
        </div>
      `,
    });

    res.status(200).json({ 
      message: 'Password reset email sent successfully' 
    });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}