// pages/api/cart/clear.js
import dbConnect from '@/lib/dbConnect';
import Cart from '@/models/cart';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await dbConnect();

  const token = await getToken({ req });
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const userId = token.id;
  if (!userId) return res.status(400).json({ message: 'User ID not found' });

  const userObjectId = new mongoose.Types.ObjectId(userId);

  try {
    const cart = await Cart.findOne({ userId: userObjectId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = []; // پاک کردن همه محصولات
    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
