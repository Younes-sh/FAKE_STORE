import Order from '@/models/Order';
import Cart from '@/models/Cart';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await dbConnect();

  const token = await getToken({ req });
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = token.id;

  // دریافت سبد خرید
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: 'سبد خرید شما خالی است' });
  }

  // آماده‌سازی آیتم‌ها
  const items = cart.products.map(p => ({
    product: p._id,
    name: p.productName,
    quantity: p.count,
    priceAtPurchase: p.price,
    image: p.image
  }));

  const subtotal = cart.products.reduce((sum, p) => sum + p.totalPrice, 0);
  const shippingFee = 0; // یا مقدار واقعی
  const taxAmount = 0; // یا مقدار واقعی
  const totalAmount = subtotal + shippingFee + taxAmount;

  try {
    const order = new Order({
      user: userId,
      items,
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      paymentMethod: 'credit_card', // حتماً یکی از enum معتبر
      shippingAddress: {
        street: 'آدرس نمونه',
        city: 'شهر نمونه',
        country: 'کشور نمونه'
      },
      status: 'processing' // حتماً یکی از enum معتبر
    });

    const savedOrder = await order.save();

    // خالی کردن سبد خرید بعد از سفارش
    cart.products = [];
    await cart.save();

    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error('❌ Order creation failed:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
