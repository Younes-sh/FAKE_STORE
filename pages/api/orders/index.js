// api/orders/index.js
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order'; 
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

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

    // استفاده از user به جای userId (مطابق مدل)
    const orders = await Order.find({ user: session.user.id })
      .populate('user', 'firstname lastname email phone') // populate کاربر
      .sort({ createdAt: -1 });

    // ساختار مطابق مدل Order
    const formattedOrders = orders.map(order => ({
      _id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      paymentStatus: order.paymentStatus,
      items: order.items.map(item => ({
        _id: item._id || item.product, // استفاده از product اگر _id نیست
        name: item.name,
        quantity: item.quantity,
        price: item.priceAtPurchase,
        priceAtPurchase: item.priceAtPurchase, // برای compatibility
        image: item.image,
        totalPrice: item.priceAtPurchase * item.quantity
      }))
    }));

    console.log(`📦 Found ${formattedOrders.length} orders for user ${session.user.id}`);

    return res.status(200).json({ 
      success: true, 
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}