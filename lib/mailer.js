import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// فقط یک transporter داشته باشیم
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// فقط یک بار verify کنیم
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready to send messages');
  }
});

// تابع برای ارسال کد تأیید
export async function sendVerificationCode({ to, code }) {
  try {
    const appName = 'Jewelry store';
    const subject = `${appName} - Your verification code`;
    
    // مسیر تصویر برای ایمیل تأیید
    const imagePath = path.join(process.cwd(), 'public/asset/mail/maile_image.jpg');
    const attachments = [];
    
    if (fs.existsSync(imagePath)) {
      attachments.push({
        filename: 'maile_image.jpg',
        path: imagePath,
        cid: 'image1'
      });
      console.log('🖼️ Image attached successfully');
    } else {
      console.log('⚠️ Image file not found at:', imagePath);
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
        <!-- هدر با گرادیان -->
        <div style="background: #805ad5; background: linear-gradient(135deg, #b38bff, #805ad5); color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold;">${appName}</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Authentication</p>
        </div>
        
        <!-- تصویر -->
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
          Please do not share this code with anyone.
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
      attachments: attachments
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent successfully! Message ID:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('❌ Verification email sending failed:', error);
    handleEmailError(error);
    throw error;
  }
}

export async function sendResetPasswordEmail({ to, resetToken, resetUrl }) {
  try {
    console.log('🚀 Starting sendResetPasswordEmail function');
    console.log('📧 To:', to);
    console.log('🔑 Token:', resetToken);
    
    const appName = 'Jewelry store';
    const subject = `Password Reset Request - ${appName}`;
    
    // مسیر تصویر برای ایمیل ریست پسورد
    const imagePath = path.join(process.cwd(), 'public/asset/mail/image_reset_page.jpg');
    const attachments = [];
    
    console.log('🔍 Image path:', imagePath);
    console.log('🔍 Image exists?', fs.existsSync(imagePath));
    
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      console.log('✅ Image found! Size:', stats.size, 'bytes');
      
      attachments.push({
        filename: 'image_reset_page.jpg',
        path: imagePath,
        cid: 'image1'
      });
      console.log('🖼️ Image attached successfully');
    } else {
      console.log('❌ Image file not found');
      // لیست فایل‌های موجود
      const dirPath = path.join(process.cwd(), 'public/asset/mail');
      const files = fs.readdirSync(dirPath);
      console.log('📁 Files in directory:', files);
    }

    const html = `
    <!DOCTYPE html>
    <html dir="ltr" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f4f4f4; font-family: Tahoma, Verdana, Arial, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- هدر -->
        <div style="background: #805ad5; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold;">${appName}</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset</p>
        </div>
        
        <!-- تصویر -->
        <div style="text-align: center; padding: 10px;">
          ${attachments.length > 0 ? 
            '<img src="cid:image1" alt="Reset Password" style="width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">' : 
            '<div style="width: 100%; height: 200px; background: #805ad5; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; border-radius: 8px;">Reset Password Image</div>'
          }
        </div>
        
        <!-- محتوا -->
        <div style="padding: 25px; text-align: center;">
          <p style="font-size: 16px; margin-bottom: 12px;">Hello dear,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Your password reset code:</p>
          
          <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f9f9f9; margin: 0 auto; padding: 15px 20px; border-radius: 8px; border: 1px dashed #805ad5; min-width: 200px;">
            ${resetToken}
          </div>
          
          <div style="margin: 25px 0;">
            <a href="${resetUrl}?token=${resetToken}" style="display: inline-block; background: #805ad5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">This code expires in 1 hour.</p>
        </div>
        
        <!-- فوتر -->
        <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #777;">
          If you didn't request this, please ignore this email.
          <br>© ${new Date().getFullYear()} ${appName}
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
      attachments: attachments
    };

    console.log('📤 Sending email with attachments:', attachments.length);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent! Message ID:', result.messageId);
    console.log('✅ Email response:', result.response);
    
    return result;
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('❌ Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
}

// به lib/mailer.js اضافه کنید
export function generateEmailTemplate(resetToken, resetUrl) {
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="fa">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Request</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f4f4f4; font-family: Tahoma, Verdana, Arial, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
        <!-- هدر -->
        <div style="background: #805ad5; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 22px; font-weight: bold;">Jewelry Store</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Password Reset</p>
        </div>
        
        <!-- محتوا -->
        <div style="padding: 25px; text-align: center;">
          <p style="font-size: 16px; margin-bottom: 12px;">Hello dear,</p>
          <p style="font-size: 16px; margin-bottom: 20px;">Your password reset code:</p>
          
          <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f9f9f9; margin: 0 auto; padding: 15px 20px; border-radius: 8px; border: 1px dashed #805ad5; min-width: 200px;">
            ${resetToken}
          </div>
          
          <div style="margin: 25px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #805ad5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">This code expires in 1 hour.</p>
        </div>
        
        <!-- فوتر -->
        <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #777;">
          If you didn't request this, please ignore this email.
          <br>© ${new Date().getFullYear()} Jewelry Store
        </div>
      </div>
    </body>
    </html>
  `;
}

function handleEmailError(error) {
  if (error.code === 'EAUTH') {
    console.error('❌ Authentication failed. Check email credentials.');
  } else if (error.code === 'ECONNECTION') {
    console.error('❌ Connection failed. Check SMTP settings.');
  } else if (error.code === 'EENVELOPE') {
    console.error('❌ Invalid email address.');
  } else {
    console.error('❌ Unknown email error:', error);
  }
}