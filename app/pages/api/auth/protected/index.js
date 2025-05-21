import { authMiddleware } from '@/lib/authMiddleware';
import MongoDB from '@/lib/dbConnect';
import User from '@/models/User';

const handler = async (req, res) => {
  // اطمینان از اتصال به MongoDB
  await MongoDB();

  // بررسی وجود کاربر
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // بازگرداندن پیام خوش‌آمدگویی
  return res.status(200).json({ message: `Welcome ${user.firstname}` });
};

export default authMiddleware(handler);  // استفاده از middleware برای محافظت از API