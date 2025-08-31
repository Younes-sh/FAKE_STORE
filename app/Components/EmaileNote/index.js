export function generateEmailTemplate(resetToken, resetUrl) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request - Jewelry Luxe</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            body {
                background-color: #f5f7fa;
                padding: 20px;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                border: 1px solid #e6e9ef;
            }
            
            .email-header {
                background: linear-gradient(135deg, #6c63ff 0%, #4a40cc 100%);
                color: white;
                padding: 28px;
                text-align: center;
            }
            
            .email-header h1 {
                font-size: 26px;
                font-weight: 700;
                margin-bottom: 8px;
            }
            
            .email-body {
                padding: 32px;
                color: #334155;
            }
            
            .greeting {
                font-size: 18px;
                margin-bottom: 16px;
                color: #1e293b;
            }
            
            .message {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            
            .verification-code {
                background: #f8fafc;
                border: 2px dashed #e2e8f0;
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin: 28px 0;
            }
            
            .code {
                font-size: 42px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #6c63ff;
                margin: 12px 0;
                font-family: monospace;
            }
            
            .code-label {
                font-size: 14px;
                color: #64748b;
                margin-bottom: 8px;
            }
            
            .validity {
                font-size: 14px;
                color: #64748b;
                margin-top: 8px;
            }
            
            .cta-button {
                text-align: center;
                margin: 32px 0;
            }
            
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #6c63ff 0%, #4a40cc 100%);
                color: white;
                text-decoration: none;
                padding: 16px 36px;
                border-radius: 50px;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(108, 99, 255, 0.25);
            }
            
            .button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(108, 99, 255, 0.35);
            }
            
            .url-container {
                background: #f8fafc;
                border-radius: 8px;
                padding: 16px;
                margin: 20px 0;
                text-align: center;
            }
            
            .url {
                font-size: 14px;
                color: #6c63ff;
                word-break: break-all;
                line-height: 1.5;
            }
            
            .footer {
                background: #f1f5f9;
                text-align: center;
                padding: 24px;
                font-size: 14px;
                color: #64748b;
            }
            
            .warning {
                color: #ef4444;
                font-weight: 500;
            }
            
            .support {
                margin-top: 12px;
            }
            
            @media (max-width: 640px) {
                .email-body {
                    padding: 24px;
                }
                
                .code {
                    font-size: 32px;
                    letter-spacing: 6px;
                }
                
                .button {
                    padding: 14px 28px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="email-header">
                <h1>Password Reset Request</h1>
                <p>Jewelry Luxe Account Security</p>
            </div>
            
            <div class="email-body">
                <p class="greeting">Hello,</p>
                
                <p class="message">You recently requested to reset your password for your Jewelry Luxe account. Use the verification code below to complete the process.</p>
                
                <div class="verification-code">
                    <div class="code-label">YOUR VERIFICATION CODE</div>
                    <div class="code">${resetToken}</div>
                    <div class="validity">This code is valid for <strong>1 hour</strong></div>
                </div>
                
                <div class="cta-button">
                    <a href="${resetUrl}" class="button">Reset Your Password</a>
                </div>
                
                <p class="message">Or copy and paste this URL into your browser:</p>
                
                <div class="url-container">
                    <p class="url">${resetUrl}</p>
                </div>
                
                <p class="message">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
            
            <div class="footer">
                <p class="warning">Please do not share this code with anyone.</p>
                <p>Jewelry Luxe will never ask for your password or verification codes.</p>
                <p class="support">Need help? Contact our support team at support@jewelryluxe.com</p>
                <p>© ${new Date().getFullYear()} Jewelry Luxe. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

export default generateEmailTemplate;