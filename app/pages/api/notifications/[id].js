import Notification from '@/models/Notification';
import UserNotification from '@/models/UserNotification';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    await dbConnect();

    const token = await getToken({ req });
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.query;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }

    const { method } = req;

    switch (method) {
      case 'GET':
        // دریافت جزئیات نوتیفیکیشن
        try {
          const userNotification = await UserNotification.findOne({
            notification: id,
            user: token.id
          }).populate('notification');

          if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
          }

          res.status(200).json({ success: true, notification: userNotification });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      case 'PUT':
        // علامت‌گذاری به عنوان خوانده شده
        try {
          const userNotification = await UserNotification.findOneAndUpdate(
            { notification: id, user: token.id },
            { isRead: true, readAt: new Date() },
            { new: true }
          ).populate('notification');

          if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
          }

          res.status(200).json({ success: true, notification: userNotification });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      case 'DELETE':
        // حذف نوتیفیکیشن برای کاربر
        try {
          const userNotification = await UserNotification.findOneAndUpdate(
            { notification: id, user: token.id },
            { isDeleted: true },
            { new: true }
          );

          if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
          }

          res.status(200).json({ success: true, message: 'Notification deleted' });
        } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}