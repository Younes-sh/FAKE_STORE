export default function handler(req, res) {
    // بررسی method
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    // برگرداندن داده‌های نمونه
    res.status(200).json({
      isPrivate: true,
      allowComments: true,
      showOnlineStatus: false
    });
  }