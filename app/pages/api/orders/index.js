// api/orders/index.js
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order'; 
import User from '@/models/user';   
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

// api/orders/index.js
export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // اضافه کردن header برای جلوگیری از کش
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const orders = await Order.find({ user: session.user.id })
      .populate('user')
      .sort({ createdAt: -1 }); // مرتب سازی بر اساس جدیدترین سفارش

    return res.status(200).json({ 
      success: true, 
      orders: JSON.parse(JSON.stringify(orders)) // برای اطمینان از سریالیزه شدن
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}