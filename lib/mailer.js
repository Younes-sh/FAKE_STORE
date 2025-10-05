// lib/mailer.js
import nodemailer from 'nodemailer';
import fs from 'fs'; // برای خواندن فایل تصویر
import path from 'path'; // برای مدیریت مسیر فایل‌ها

// console.log('📧 Email Config Check:');
// console.log('Host:', process.env.EMAIL_SERVER_HOST);
// console.log('Port:', process.env.EMAIL_SERVER_PORT);
// console.log('User:', process.env.EMAIL_SERVER_USER);
// console.log('From:', process.env.EMAIL_FROM);

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// دیباگ transporter
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

export async function sendVerificationCode({ to, code }) {
  try {
    
    const appName = 'Jewelry store';
    const subject = `${appName} - Your verification code`;
    
    // مسیر صحیح تصویر در Next.js (از root پروژه به public)
    const imagePath = path.join(process.cwd(), 'public/asset/mail/maile_image.jpg');
    const attachments = [];
    
    if (fs.existsSync(imagePath)) {
      attachments.push({
        filename: 'maile_image.jpg',
        path: imagePath,
        cid: 'image1' // شناسه برای استفاده در HTML
      });
      console.log('🖼️ Image attached successfully');
    } else {
      // console.log('⚠️ Image file not found at:', imagePath);
      // اگر فایل پیدا نشد، یک placeholder یا URL خارجی امتحان کنید
    }
    
    const html = `
    <!DOCTYPE html>
    <html dir="ltr" lang="fa" style="margin: 0; padding: 0;">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f4f4f4; font-family: Tahoma, Verdana, Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #eee;">
        <!-- هدر با گرادیان (fallback برای کلاینت‌های قدیمی) -->
        <div style="background: #805ad5; /* fallback color */ background: linear-gradient(135deg, #b38bff, #805ad5); color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold;">${appName}</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Authentication</p>
        </div>
        
        <!-- تصویر (با fallback اگر نمایش داده نشود) -->
        <div style="text-align: center; padding: 10px;">
          ${attachments.length > 0 ? '<img src="cid:image1" alt="Verification Image" style="width: 100%; max-height: 200px; object-fit: cover; display: block;">' : '<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #b38bff, #805ad5); display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">Verification Image</div>'}
        </div>
        
        <!-- محتوای اصلی -->
        <div style="padding: 25px; text-align: center;">
          <p style="font-size: 16px; margin-bottom: 12px;">Hello dear,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Your verification code:</p>
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f9f9f9; margin: 0 auto; padding: 15px 20px; border-radius: 8px; border: 1px dashed #805ad5; min-width: 200px;">
              ${code}
            </div>
          </div>
          <div style="font-size: 14px; color: #666; margin: 0; display: block;">
            <br>
            </div>
           <p style="font-size: 14px; color: #666; margin: 0;">This code is valid for up to <b>15 minutes</b>.</p>
        </div>
        
        <!-- فوتر -->
        <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #777; border-top: 1px solid #eee;">
         Please do not share this code with anyone..
          <br><small style="color: #999;">© ${new Date().getFullYear()} ${appName}</small>
        </div>
      </div>
    </body>
    </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments // فقط اگر تصویر وجود داشته باشد
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! Message ID:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    
    // خطاهای رایج
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Check email and password.');
    } else if (error.code === 'ECONNECTION') {
      console.error('Connection failed. Check SMTP settings.');
    } else if (error.code === 'EENVELOPE') {
      console.error('Invalid email address.');
    }
    
    throw error;
  }
}