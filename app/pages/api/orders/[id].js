// api/orders/[id].js
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/order';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const order = await Order.findById(id)
      .populate('user', 'firstname lastname email phone address');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // ساختار مطابق مدل
    const formattedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        _id: item._id || item.product,
        name: item.name,
        quantity: item.quantity,
        price: item.priceAtPurchase,
        priceAtPurchase: item.priceAtPurchase,
        image: item.image,
        totalPrice: item.priceAtPurchase * item.quantity
      })),
      user: {
        firstname: order.user?.firstname,
        lastname: order.user?.lastname,
        email: order.user?.email,
        phone: order.user?.phone,
        address: order.user?.address
      }
    };

    console.log('📄 Order details fetched:', formattedOrder._id);

    return res.status(200).json({ order: formattedOrder });

  } catch (error) {
    console.error('Error fetching order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}