import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import User from '../models/user'; // مدل کاربر شما
import dbConnect from './dbConnect'; // اتصال به دیتابیس

export const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      await dbConnect(); // اتصال به دیتابیس

      // 1. بررسی توکن NextAuth.js
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      
      if (nextAuthToken) {
        // بررسی آخرین وضعیت کاربر از دیتابیس
        const currentUser = await User.findById(nextAuthToken.id).select('role isActive');
        
        if (!currentUser) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        if (!currentUser.isActive) {
          return res.status(403).json({ message: 'Account is blocked' });
        }
        
        // بررسی نقش کاربر
        if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
          return res.status(403).json({ 
            message: `Access denied - Required roles: ${requiredRoles.join(', ')}`,
            yourRole: currentUser.role
          });
        }
        
        req.user = {
          ...nextAuthToken,
          role: currentUser.role, // استفاده از نقش از دیتابیس نه توکن
          isActive: currentUser.isActive
        };
        
        return next();
      }

      // 2. بررسی توکن JWT استاندارد
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Token missing' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // بررسی آخرین وضعیت کاربر از دیتابیس
      const currentUser = await User.findById(decoded.id).select('role isActive');
      
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!currentUser.isActive) {
        return res.status(403).json({ message: 'Account is blocked' });
      }
      
      // بررسی نقش مورد نیاز
      if (requiredRoles.length > 0 && !requiredRoles.includes(currentUser.role)) {
        return res.status(403).json({ 
          message: `Access denied - Required roles: ${requiredRoles.join(', ')}`,
          yourRole: currentUser.role
        });
      }

      // به‌روزرسانی اطلاعات کاربر با آخرین وضعیت از دیتابیس
      req.user = {
        id: currentUser._id,
        email: decoded.email,
        role: currentUser.role, // استفاده از نقش از دیتابیس
        isActive: currentUser.isActive,
        username: decoded.username
      };

      // لاگ دسترسی
      console.log(`Access granted to: ${decoded.email} with role: ${currentUser.role}`);

      return next();
    } catch (error) {
      console.error('Authentication error:', error.message);
      
      // پاسخ‌های خطای دقیق‌تر
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Session expired',
          solution: 'Please login again',
          errorCode: 'TOKEN_EXPIRED'
        });
      }
      
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          message: 'Invalid token',
          solution: 'Please login again',
          errorCode: 'INVALID_TOKEN'
        });
      }

      return res.status(500).json({ 
        message: 'Authentication failed',
        technicalDetails: error.message,
        errorCode: 'AUTH_ERROR'
      });
    }
  };
};

// میدلور برای بررسی API Key
export const apiKeyMiddleware = (handler) => {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ 
        message: 'Invalid API Key',
        documentation: 'https://example.com/api-docs',
        errorCode: 'INVALID_API_KEY'
      });
    }
    
    return handler(req, res);
  };
};