import Notification from '@/models/Notification';
import User from '@/models/User';
import UserNotification from '@/models/UserNotification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = await getToken({ req });
    if (!token || !['admin', 'editor'].includes(token.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        // دریافت همه نوتیفیکیشن‌ها برای ادمین
        try {
          const { page = 1, limit = 20 } = req.query;
          
          const notifications = await Notification.find()
            .populate('createdBy', 'username email')
            .populate('relatedProduct', 'productName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

          const total = await Notification.countDocuments();

          res.status(200).json({
            success: true,
            notifications,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
          });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      case 'POST':
        // ایجاد نوتیفیکیشن و ارسال به کاربران
        try {
          const { title, message, type, targetUsers, isForAllUsers, relatedProduct, expiresAt } = req.body;

          console.log('📨 Creating notification with data:', {
            title,
            message,
            type,
            isForAllUsers,
            targetUsersCount: targetUsers?.length || 0,
            relatedProduct
          });

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
          console.log('✅ Notification created:', savedNotification._id);

          // ایجاد UserNotification برای کاربران هدف
          let usersToNotify = [];
          
          if (isForAllUsers) {
            usersToNotify = await User.find({ isActive: true }).select('_id');
            console.log(`👥 Found ${usersToNotify.length} active users for all-users notification`);
          } else if (targetUsers && targetUsers.length > 0) {
            // اطمینان از اینکه targetUsers آرایه ای از ObjectId است
            const targetUserIds = targetUsers.map(id => 
              mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : null
            ).filter(id => id !== null);

            if (targetUserIds.length > 0) {
              usersToNotify = await User.find({ 
                _id: { $in: targetUserIds },
                isActive: true 
              }).select('_id');
              console.log(`👥 Found ${usersToNotify.length} active users from target list`);
            }
          }

          if (usersToNotify.length > 0) {
            const userNotifications = usersToNotify.map(user => ({
              user: user._id,
              notification: savedNotification._id
            }));

            console.log(`📝 Creating ${userNotifications.length} user notifications...`);
            
            try {
              const result = await UserNotification.insertMany(userNotifications, { ordered: false });
              console.log(`✅ Created ${result.length} user notifications successfully`);
            } catch (insertError) {
              // حتی اگر برخی insertها fail شوند، ادامه بده
              console.log('⚠️ Some user notifications may not have been created:', insertError.message);
            }
          } else {
            console.log('⚠️ No users to notify');
          }

          res.status(201).json({ 
            success: true, 
            notification: savedNotification,
            usersNotified: usersToNotify.length
          });
        } catch (error) {
          console.error('❌ Error creating notification:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('❌ General error in admin notifications API:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}