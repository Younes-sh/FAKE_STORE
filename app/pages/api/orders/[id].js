import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';
import User from '@/models/user';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const order = await Order.findById(id)
      .populate({
        path: 'user',
        select: 'firstname lastname email phone address',
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
