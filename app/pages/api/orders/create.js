// pages/api/orders/create.js
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import Cart from "@/models/cart";
import Order from "@/models/order";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const cart = await Cart.findOne({ userId: user._id });
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  // گرفتن اطلاعات ارسال‌شده از کلاینت
  const {
    paymentMethod,
    shippingAddress,
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    items
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No order items provided" });
  }

  // ساخت سفارش
  const order = new Order({
    user: user._id,
    items: items.map(item => ({
      product: item._id,
      name: item.productName,
      quantity: item.count,
      priceAtPurchase: item.price,
      image: item.image
    })),
    subtotal,
    shippingFee,
    taxAmount,
    totalAmount,
    paymentMethod,
    shippingAddress: {
      street: shippingAddress.address || "No address",
      city: shippingAddress.city || "",
      state: shippingAddress.state || "",
      postalCode: shippingAddress.postalCode || "",
      country: shippingAddress.country || "IR"
    }
  });

  await order.save();

  // پاکسازی سبد خرید پس از ثبت سفارش
  await Cart.findOneAndDelete({ userId: user._id });

  return res.status(201).json({ message: "Order created", order });
}
