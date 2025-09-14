// pages/api/notifications/cleanup.js
import UserNotification from '@/models/UserNotification';
import dbConnect from '@/lib/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // حذف UserNotification هایی که notificationDetails ندارند
    const result = await UserNotification.deleteMany({
      notificationDetails: { $exists: false }
    });

    res.status(200).json({
      success: true,
      message: `Cleaned up ${result.deletedCount} invalid notifications`
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}