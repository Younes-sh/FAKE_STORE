import { getToken } from "next-auth/jwt";

export default async function authMiddleware(req, res, next) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      return res.status(401).json({ message: 'توکن احراز هویت وجود ندارد' });
    }

    req.userId = token.id; // <-- اصلاح شده
    next();
  } catch (error) {
    console.error('خطای احراز هویت:', error);
    return res.status(401).json({ message: 'توکن نامعتبر است' });
  }
}
