// pages/api/notifications/cleanup.js
import UserNotification from '@/models/UserNotification';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  // بررسی مجوز دسترسی (فقط ادمین‌ها)
  const token = await getToken({ req });
  if (!token || !['admin', 'editor'].includes(token.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // 1. حذف UserNotification هایی که notification معتبر ندارند
    const validNotifications = await Notification.find({}, '_id');
    const validNotificationIds = validNotifications.map(n => n._id);
    
    const orphanedResult = await UserNotification.deleteMany({
      notification: { $nin: validNotificationIds }
    });

    // 2. حذف UserNotification هایی که notificationDetails ندارند
    const noDetailsResult = await UserNotification.deleteMany({
      $or: [
        { notificationDetails: { $exists: false } },
        { notificationDetails: null }
      ]
    });

    // 3. حذف نوتیفیکیشن‌های قدیمی (اختیاری)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldNotificationsResult = await UserNotification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      isRead: true // فقط نوتیفیکیشن‌های خوانده شده قدیمی
    });

    res.status(200).json({
      success: true,
      message: 'Cleanup completed successfully',
      details: {
        orphanedNotificationsRemoved: orphanedResult.deletedCount,
        noDetailsNotificationsRemoved: noDetailsResult.deletedCount,
        oldNotificationsRemoved: oldNotificationsResult.deletedCount,
        totalRemoved: orphanedResult.deletedCount + noDetailsResult.deletedCount + oldNotificationsResult.deletedCount
      }
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}