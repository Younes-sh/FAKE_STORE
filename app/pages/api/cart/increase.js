import Cart from '@/models/cart';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const token = await getToken({ req });
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const userId = token.id;
    if (!userId) return res.status(400).json({ message: 'User ID not found' });

    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // پیدا کردن سبد خرید کاربر
    const cart = await Cart.findOne({ userId: userObjectId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    // پیدا کردن محصول در سبد
    const productIndex = cart.products.findIndex(
      item => item._id.toString() === productObjectId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // افزایش تعداد
    cart.products[productIndex].count += 1;
    cart.products[productIndex].totalPrice = 
      cart.products[productIndex].price * cart.products[productIndex].count;

    await cart.save();

    return res.status(200).json({ 
      success: true, 
      cart 
    });

  } catch (error) {
    console.error('Error increasing product quantity:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}