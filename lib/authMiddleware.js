import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import User from '../models/user';
import dbConnect from './dbConnect';

export const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      await dbConnect();

      // 1. بررسی توکن NextAuth
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

      if (nextAuthToken) {
        const userId = nextAuthToken.sub; // sub به جای id
        const currentUser = await User.findById(userId).select('role isActive');

        if (!currentUser) return res.status(404).json({ message: 'User not found' });
        if (!currentUser.isActive) return res.status(403).json({ message: 'Account is blocked' });

        if (requiredRoles.length && !requiredRoles.includes(currentUser.role)) {
          return res.status(403).json({
            message: `Access denied - Required roles: ${requiredRoles.join(', ')}`,
            yourRole: currentUser.role,
          });
        }

        req.user = {
          id: userId,
          email: nextAuthToken.email,
          role: currentUser.role,
          isActive: currentUser.isActive,
        };

        return next();
      }

      // 2. بررسی JWT سفارشی
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ message: 'Authorization header missing' });

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token missing' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id).select('role isActive');

      if (!currentUser) return res.status(404).json({ message: 'User not found' });
      if (!currentUser.isActive) return res.status(403).json({ message: 'Account is blocked' });

      if (requiredRoles.length && !requiredRoles.includes(currentUser.role)) {
        return res.status(403).json({
          message: `Access denied - Required roles: ${requiredRoles.join(', ')}`,
          yourRole: currentUser.role,
        });
      }

      req.user = {
        id: currentUser._id,
        email: decoded.email,
        role: currentUser.role,
        isActive: currentUser.isActive,
        username: decoded.username,
      };

      return next();
    } catch (error) {
      console.error('Authentication error:', error.message);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired', errorCode: 'TOKEN_EXPIRED' });
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token', errorCode: 'INVALID_TOKEN' });
      }

      return res.status(500).json({ message: 'Authentication failed', errorCode: 'AUTH_ERROR' });
    }
  };
};

// Middleware برای API Key
export const apiKeyMiddleware = (handler) => {
  return async (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey.trim() !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ message: 'Invalid API Key', errorCode: 'INVALID_API_KEY' });
    }
    return handler(req, res);
  };
};
