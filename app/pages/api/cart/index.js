// pages/api/cart/index.js
import Cart from '@/models/cart';
import dbConnect from '@/lib/dbConnect';
import { getToken } from 'next-auth/jwt';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  try {
    console.log('🔍 Cart API called with method:', req.method);

    await dbConnect();

    const token = await getToken({ req });
    console.log('🔍 Token received:', token ? 'exists' : 'null');

    if (!token) {
      console.error('❌ No token - 401 Unauthorized');
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    const userId = token.id;
    console.log('🔍 User ID from token:', userId);

    if (!userId) {
      console.error('❌ No userId in token - 400 Bad Request');
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    // تبدیل userId به ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const { method } = req;

    switch (method) {
      case 'GET':
        try {
          const cart = await Cart.findOne({ userId: userObjectId });
          
          console.log('📦 Cart found:', cart ? 'yes' : 'no');
          if (cart) {
            console.log('📦 Cart products:', cart.products.length);
          }
          
          if (!cart) {
            return res.status(200).json({ 
              success: true, 
              cart: { products: [], userId: userObjectId } 
            });
          }

          // تبدیل تمام ObjectIdها به رشته
          const formattedCart = {
            ...cart.toObject(),
            userId: cart.userId.toString(),
            products: cart.products.map(item => ({
              ...item,
              _id: item._id.toString(),
              // اطمینان از وجود تمام فیلدها
              productName: item.productName || 'Unknown Product',
              price: item.price || 0,
              count: item.count || 1,
              totalPrice: item.totalPrice || (item.price || 0) * (item.count || 1),
              image: item.image || '',
              description: item.description || '',
              section: item.section || '',
              model: item.model || ''
            }))
          };

          return res.status(200).json({ 
            success: true, 
            cart: formattedCart
          });
        } catch (error) {
          console.error('❌ Error in GET:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }

        case 'POST':
          try {
            const { product } = req.body;
            console.log('🔍 Product data received:', product);
            
            if (!product || !product._id) {
              return res.status(400).json({ message: 'Product data is required' });
            }
        
            // تبدیل product._id به ObjectId
            const productObjectId = new mongoose.Types.ObjectId(product._id);
        
            let existingCart = await Cart.findOne({ userId: userObjectId });
        
            if (!existingCart) {
              console.log('🆕 Creating new cart for user:', userId);
              const newCart = new Cart({
                userId: userObjectId,
                products: [{
                  _id: productObjectId,
                  productName: product.productName || 'Unknown Product',
                  price: product.price || 0,
                  count: 1, // همیشه با count=1 شروع شود
                  totalPrice: product.price || 0,
                  image: product.image || '',
                  description: product.description || '',
                  section: product.section || '',
                  model: product.model || ''
                }]
              });
        
              const savedCart = await newCart.save();
              console.log('✅ New cart created with ID:', savedCart._id);
              
              return res.status(201).json({ 
                success: true, 
                cart: savedCart 
              });
            }
        
            // بررسی وجود محصول در سبد خرید
            const existingProductIndex = existingCart.products.findIndex(
              item => item._id.toString() === productObjectId.toString()
            );
        
            if (existingProductIndex > -1) {
              // افزایش تعداد محصول موجود
              existingCart.products[existingProductIndex].count += 1;
              existingCart.products[existingProductIndex].totalPrice = 
                existingCart.products[existingProductIndex].price * 
                existingCart.products[existingProductIndex].count;
              console.log('➕ Increased quantity for existing product');
            } else {
              // افزودن محصول جدید
              existingCart.products.push({
                _id: productObjectId,
                productName: product.productName || 'Unknown Product',
                price: product.price || 0,
                count: 1, // همیشه با count=1 شروع شود
                totalPrice: product.price || 0,
                image: product.image || '',
                description: product.description || '',
                section: product.section || '',
                model: product.model || ''
              });
              console.log('🆕 Added new product to cart');
            }
        
            const updatedCart = await existingCart.save();
            console.log('✅ Cart updated successfully');
            
            return res.status(200).json({ 
              success: true, 
              cart: updatedCart 
            });
        
          } catch (error) {
            console.error('❌ Error in POST:', error);
            return res.status(500).json({ 
              message: 'Server error', 
              error: error.message 
            });
          }

      case 'PUT':
        try {
          const { productId, count } = req.body;
          
          if (!productId || count === undefined) {
            return res.status(400).json({ message: 'Product ID and count are required' });
          }

          const cartToUpdate = await Cart.findOne({ userId: userObjectId });
          if (!cartToUpdate) {
            return res.status(404).json({ message: 'Cart not found' });
          }

          const productToUpdate = cartToUpdate.products.find(
            item => item._id.toString() === productId.toString()
          );

          if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found in cart' });
          }

          productToUpdate.count = count;
          productToUpdate.totalPrice = productToUpdate.price * count;

          const updatedCart = await cartToUpdate.save();
          return res.status(200).json({ success: true, cart: updatedCart });

        } catch (error) {
          console.error('❌ Error in PUT:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }

      case 'DELETE':
        try {
          const { productId } = req.body;
          
          if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
          }

          const cartToDeleteFrom = await Cart.findOne({ userId: userObjectId });
          if (!cartToDeleteFrom) {
            return res.status(404).json({ message: 'Cart not found' });
          }

          cartToDeleteFrom.products = cartToDeleteFrom.products.filter(
            item => item._id.toString() !== productId.toString()
          );

          const updatedCart = await cartToDeleteFrom.save();
          return res.status(200).json({ success: true, cart: updatedCart });

        } catch (error) {
          console.error('❌ Error in DELETE:', error);
          return res.status(500).json({ message: 'Server error', error: error.message });
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('❌ General error in cart API:', error);
    return res.status(500).json({ 
      message: 'Server error', 
      error: error.message
    });
  }
}