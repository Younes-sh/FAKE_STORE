// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';

export const authMiddleware = (handler) => {
  return async (req, res) => {
    try {
      // روش 1: بررسی توکن NextAuth.js (ترجیحی)
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (nextAuthToken) {
        if (nextAuthToken.role !== 'admin') {
          return res.status(403).json({ message: 'Access denied - Admin role required' });
        }
        req.user = nextAuthToken;
        return handler(req, res);
      }

      // روش 2: بررسی توکن JWT استاندارد (برای سازگاری با سیستم‌های قدیمی)
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (!decoded.role || decoded.role !== 'admin') {
        return res.status(403).json({ 
          message: 'Access denied - Invalid privileges',
          details: 'User role does not have admin access'
        });
      }

      // اضافه کردن اطلاعات کاربر به درخواست
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        username: decoded.username
      };

      // لاگ برای بررسی‌های امنیتی
      console.log(`Admin access granted to: ${decoded.email}`);

      return handler(req, res);
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      // پاسخ‌های خطای دقیق‌تر
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Session expired',
          solution: 'Please refresh your token'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          solution: 'Please login again'
        });
      }

      return res.status(500).json({ 
        message: 'Authentication failed',
        technicalDetails: error.message 
      });
    }
  };
};

// میدلور برای بررسی API Key در صورت نیاز
export const apiKeyMiddleware = (handler) => {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ 
        message: 'Invalid API Key',
        documentation: 'https://example.com/api-docs' 
      });
    }
    
    return handler(req, res);
  };
};