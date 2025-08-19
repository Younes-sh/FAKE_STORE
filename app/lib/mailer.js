// lib/mailer.js
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || 465),
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendVerificationCode({ to, code }) {
  const appName = 'Jewelry store';
  const subject = `${appName} - Your verification code`;
  const html = `
    <div style="font-family:Tahoma,Verdana,Arial,sans-serif;max-width:500px;margin:auto">
      <h2>${appName}</h2>
      <p>Hello,</p>
      <p>Your verification code is:</p>
      <div style="font-size:28px;letter-spacing:6px;font-weight:bold">${code}</div>
      <p>This code is valid for 15 minutes.</p>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}
