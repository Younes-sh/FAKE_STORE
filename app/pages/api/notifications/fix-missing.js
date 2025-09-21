// pages/api/notifications/fix-missing.js
import Notification from '@/models/Notification';
import User from '@/models/user';
import UserNotification from '@/models/UserNotification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = await getToken({ req });
    if (!token || !['admin', 'editor'].includes(token.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    // پیدا کردن همه نوتیفیکیشن‌های فعال
    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    });

    console.log(`📋 Found ${notifications.length} active notifications`);

    let totalCreated = 0;

    // برای هر نوتیفیکیشن، UserNotificationهای از دست رفته را ایجاد کن
    for (const notification of notifications) {
      // پیدا کردن کاربرانی که باید این نوتیفیکیشن را دریافت کنند
      let usersToNotify = [];
      
      if (notification.isForAllUsers) {
        usersToNotify = await User.find({ isActive: true }).select('_id');
      } else if (notification.targetUsers && notification.targetUsers.length > 0) {
        usersToNotify = await User.find({ 
          _id: { $in: notification.targetUsers },
          isActive: true 
        }).select('_id');
      }

      console.log(`👥 Notification ${notification._id}: ${usersToNotify.length} users to notify`);

      // برای هر کاربر، بررسی کن که آیا UserNotification وجود دارد یا نه
      for (const user of usersToNotify) {
        const existingUserNotification = await UserNotification.findOne({
          user: user._id,
          notification: notification._id,
          isDeleted: false
        });

        if (!existingUserNotification) {
          // UserNotification وجود ندارد، پس ایجادش کن
          const newUserNotification = new UserNotification({
            user: user._id,
            notification: notification._id,
            isRead: false
          });

          await newUserNotification.save();
          totalCreated++;
          console.log(`✅ Created UserNotification for user ${user._id} and notification ${notification._id}`);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: `Created ${totalCreated} missing UserNotifications`,
      totalCreated
    });

  } catch (error) {
    console.error('Error fixing missing notifications:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}