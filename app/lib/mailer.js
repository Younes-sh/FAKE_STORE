// lib/mailer.js
import nodemailer from 'nodemailer';

console.log('📧 Email Config Check:');
console.log('Host:', process.env.EMAIL_SERVER_HOST);
console.log('Port:', process.env.EMAIL_SERVER_PORT);
console.log('User:', process.env.EMAIL_SERVER_USER);
console.log('From:', process.env.EMAIL_FROM);

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
    console.log('📤 Attempting to send email to:', to);
    console.log('🔑 Code:', code);
    
    const appName = 'Jewelry store';
    const subject = `${appName} - Your verification code`;
    const html = `
    <div style="font-family: Tahoma, Verdana, Arial, sans-serif; max-width: 500px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; border: 1px solid #eee;">
      <div style="background: linear-gradient(135deg, #b38bff, #805ad5); color: white; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-size: 22px;">${appName}</h2>
      </div>
      <div style="padding: 25px; color: #333; text-align: center;">
        <p style="font-size: 16px; margin-bottom: 12px;">Hello,</p>
        <p style="font-size: 16px; margin-bottom: 20px;">Your verification code is:</p>
        <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #f9f9f9; padding: 15px 20px; border-radius: 8px; display: inline-block; margin-bottom: 20px; border: 1px dashed #805ad5;">
          ${code}
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 15px;">This code is valid for <b>15 minutes</b>.</p>
      </div>
      <div style="background: #f5f5f5; text-align: center; padding: 15px; font-size: 12px; color: #777;">
        Please do not share this code with anyone.
      </div>
    </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: html,
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