// pages/api/notifications/admin/index.js
import Notification from '@/models/Notification';
import User from '@/models/user';
import UserNotification from '@/models/UserNotification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  console.log('🔔 API Notifications Admin called:', req.method);
  
  try {
    // اتصال به دیتابیس
    await dbConnect();
    console.log('✅ Database connected successfully');

    // بررسی احراز هویت
    const token = await getToken({ req });
    
    if (!token) {
      console.log('❌ No token found');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (!['admin', 'editor'].includes(token.role)) {
      console.log('❌ Invalid role:', token.role);
      return res.status(403).json({ message: 'Access denied' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          // console.log('📋 Fetching notifications...');
          
          // دریافت نوتیفیکیشن‌ها بدون populate مربوط به Product
          // برای جلوگیری از خطا اگر مدل Product وجود ندارد
          let notifications;
          
          try {
            // سعی می‌کنیم با populate محصولات دریافت کنیم
            notifications = await Notification.find({})
              .populate('createdBy', 'username email')
              .populate('relatedProduct', 'productName')
              .sort({ createdAt: -1 })
              .lean();
          } catch (populateError) {
            console.warn('❌ Populate failed, fetching without product data:', populateError.message);
            // اگر populate با خطا مواجه شد، بدون آن داده را دریافت می‌کنیم
            notifications = await Notification.find({})
              .populate('createdBy', 'username email')
              .sort({ createdAt: -1 })
              .lean();
          }

          // console.log(`✅ Found ${notifications.length} notifications`);

          res.status(200).json({
            success: true,
            notifications,
            total: notifications.length
          });
        } catch (error) {
          console.error('❌ Error in GET operation:', error);
          res.status(500).json({ 
            message: 'Error fetching notifications',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
          });
        }
        break;

      case 'POST':
        try {
          const { title, message, type, targetUsers, isForAllUsers, relatedProduct, expiresAt } = req.body;

          // console.log('📨 Creating notification:', { title, type });

          // ایجاد نوتیفیکیشن جدید
          const notification = new Notification({
            title,
            message,
            type,
            targetUsers: targetUsers || [],
            isForAllUsers: isForAllUsers !== undefined ? isForAllUsers : true,
            relatedProduct: relatedProduct || null,
            createdBy: token.id,
            expiresAt: expiresAt || null
          });

          const savedNotification = await notification.save();
          // console.log('✅ Notification created:', savedNotification._id);
           // ایجاد UserNotification برای کاربران هدف
          let usersToNotify = [];

          if (isForAllUsers) {
            usersToNotify = await User.find({ isActive: true }).select('_id');
          } else if (targetUsers && targetUsers.length > 0) {
            usersToNotify = await User.find({ 
              _id: { $in: targetUsers },
              isActive: true 
            }).select('_id');
          }
      
          if (usersToNotify.length > 0) {
            const userNotifications = usersToNotify.map(user => ({
              user: user._id,
              notification: savedNotification._id,
              isRead: false
            }));
      
            await UserNotification.insertMany(userNotifications, { ordered: false });
          }

          res.status(201).json({ 
            success: true, 
            notification: savedNotification,
            usersNotified: usersToNotify.length
          });
        } catch (error) {
          console.error('❌ Error in POST operation:', error);
          res.status(500).json({ 
            message: 'Error creating notification',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
          });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('❌ General error in admin notifications API:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}