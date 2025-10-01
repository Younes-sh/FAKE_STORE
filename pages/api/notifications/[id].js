// pages/api/notifications/[id].js
import UserNotification from '@/models/UserNotification';
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
    const { id } = req.query;

    if (req.method === 'PUT') {
      // بروزرسانی وضعیت خواندن
      try {
        const userNotification = await UserNotification.findOne({
          _id: id,
          user: userId
        });

        if (!userNotification) {
          return res.status(404).json({ message: 'Notification not found' });
        }

        userNotification.isRead = true;
        userNotification.readAt = new Date();
        await userNotification.save();

        res.status(200).json({
          success: true,
          message: 'Notification marked as read'
        });
      } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    } else if (req.method === 'DELETE') {
      // حذف نوتیفیکیشن (soft delete)
      try {
        const userNotification = await UserNotification.findOne({
          _id: id,
          user: userId
        });

        if (!userNotification) {
          return res.status(404).json({ message: 'Notification not found' });
        }

        userNotification.isDeleted = true;
        await userNotification.save();

        res.status(200).json({
          success: true,
          message: 'Notification deleted'
        });
      } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['PUT', 'DELETE']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('General error in notification API:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}