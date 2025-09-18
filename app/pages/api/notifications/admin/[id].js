// pages/api/notifications/admin/[id].js
import Notification from '@/models/Notification';
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

    const { id } = req.query;
    const { method } = req;

    switch (method) {
      case 'PUT':
        // ویرایش نوتیفیکیشن
        try {
          const { title, message, type, expiresAt } = req.body;

          const notification = await Notification.findById(id);
          if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
          }

          notification.title = title;
          notification.message = message;
          notification.type = type;
          notification.expiresAt = expiresAt || null;

          const updatedNotification = await notification.save();

          res.status(200).json({
            success: true,
            notification: updatedNotification
          });
        } catch (error) {
          console.error('❌ Error updating notification:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      case 'DELETE':
        // حذف نوتیفیکیشن
        try {
          const notification = await Notification.findById(id);
          if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
          }

          // حذف تمام UserNotificationهای مرتبط
          await UserNotification.deleteMany({ notification: id });

          // حذف خود نوتیفیکیشن
          await Notification.findByIdAndDelete(id);

          res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
          });
        } catch (error) {
          console.error('❌ Error deleting notification:', error);
          res.status(500).json({ message: 'Server error', error: error.message });
        }
        break;

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('❌ General error in admin notifications API:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}