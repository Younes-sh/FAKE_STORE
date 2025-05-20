import jwt from 'jsonwebtoken';

export const authMiddleware = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded._id;  // اضافه کردن userId به درخواست
      return handler(req, res);  // ادامه به handler اصلی
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};