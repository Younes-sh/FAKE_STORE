import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "@/lib/dbConnect";
import Cart from "@/models/cart";
import "@/models/product"; // 👈 فقط ایمپورت کردن کافیه برای register شدن
import "@/models/User"; // 👈 فقط ایمپورت کردن کافیه برای register شدن


export default async function handler(req, res) {
  await connectDB();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const userId = session.user.id;

  try {
    switch (req.method) {

      // ✅ دریافت سبد خرید کاربر
      case 'GET': {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        return res.status(200).json({ cart: cart || { userId, items: [] } });
      }

      // ✅ افزودن محصول به سبد خرید
      // ...existing code...
case 'POST': {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "Missing productId" });

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existingItem = cart.items.find(item => {
    const id = item.productId._id ? item.productId._id.toString() : item.productId.toString();
    return id === productId;
  });

  if (existingItem) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(item => {
        const id = item.productId._id ? item.productId._id.toString() : item.productId.toString();
        return id !== productId;
      });
    } else {
      existingItem.quantity = quantity;
    }
  } else {
    if (quantity > 0) {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  await cart.populate("items.productId");

  return res.status(200).json({ cart });
}
// ...existing code...

      // ✅ حذف یک محصول از سبد خرید
      case 'DELETE': {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: "Missing productId" });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        await cart.save();
        await cart.populate("items.productId");

        return res.status(200).json({ cart });
      }

      default:
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (err) {
    console.error("Cart API Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
