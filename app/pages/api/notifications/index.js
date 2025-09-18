// pages/api/notifications/index.js
import UserNotification from '@/models/UserNotification';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = token.id;
    
    if (req.method === 'GET') {
      try {
        // دریافت UserNotificationهای کاربر
        const userNotifications = await UserNotification.find({
          user: userId,
          isDeleted: false
        })
        .populate({
          path: 'notification',
          match: { 
            isActive: true,
            $or: [
              { expiresAt: { $exists: false } },
              { expiresAt: null },
              { expiresAt: { $gt: new Date() } }
            ]
          }
        })
        .sort({ createdAt: -1 })
        .lean();

        // console.log(`📨 Found ${userNotifications.length} UserNotifications for user ${userId}`);

        // فیلتر کردن UserNotificationهایی که notification معتبر دارند
        const validNotifications = userNotifications.filter(
          n => n.notification !== null
        );

        // console.log(`✅ ${validNotifications.length} valid notifications after filtering`);

        res.status(200).json({
          success: true,
          notifications: validNotifications
        });
      } catch (error) {
        console.error('Error fetching user notifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('General error in notifications API:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}