// pages/api/notifications/settings.js
import { getToken } from 'next-auth/jwt';
import User from '@/models/user';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  try {
    await dbConnect();
    
    const token = await getToken({ req });
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const userId = token.id;
    
    if (req.method === 'GET') {
      // دریافت تنظیمات نوتیفیکیشن کاربر
      const user = await User.findById(userId).select('notificationSettings');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user.notificationSettings || {});
    } 
    else if (req.method === 'POST') {
      // به‌روزرسانی تنظیمات نوتیفیکیشن کاربر
      const { emailNotifications, pushNotifications, newsUpdates, activityNotifications, messageNotifications } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          notificationSettings: {
            emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
            pushNotifications: pushNotifications !== undefined ? pushNotifications : false,
            newsUpdates: newsUpdates !== undefined ? newsUpdates : true,
            activityNotifications: activityNotifications !== undefined ? activityNotifications : true,
            messageNotifications: messageNotifications !== undefined ? messageNotifications : true,
          }
        },
        { new: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json({ message: 'Notification settings updated successfully' });
    } 
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in notification settings API:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}