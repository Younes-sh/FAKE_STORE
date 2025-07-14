import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();

    // اعتبارسنجی اولیه
    const { items = [], ...orderData } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("سبد خرید شما خالی است");
    }

    // پردازش و اعتبارسنجی آیتم‌ها
    const validatedItems = await Promise.all(items.map(async (item) => {
      if (!item._id || !item.count) {
        throw new Error("مشخصات محصول ناقص است");
      }

      const product = await Product.findById(item._id);
      if (!product) {
        throw new Error(`محصول با شناسه ${item._id} یافت نشد`);
      }

      return {
        product: item._id,
        name: product.productName,
        quantity: Number(item.count),
        priceAtPurchase: product.price,
        image: product.image,
        section: product.section,
        model: product.model
      };
    }));

    // محاسبه مبالغ
    const subtotal = validatedItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
    const shippingFee = Number(orderData.shippingFee) || 0;
    const taxAmount = Number(orderData.taxAmount) || 0;
    const totalAmount = subtotal + shippingFee + taxAmount;

    // اعتبارسنجی آدرس
    const shippingAddress = {
      street: orderData.shippingAddress?.address || '',
      city: orderData.shippingAddress?.city || '',
      state: orderData.shippingAddress?.state || '',
      postalCode: orderData.shippingAddress?.postalCode || '',
      country: orderData.shippingAddress?.country || 'IR'
    };

    if (!shippingAddress.street || !shippingAddress.city) {
      throw new Error("آدرس ارسال ناقص است");
    }

    // ایجاد سفارش
    const user = await User.findOne({ email: session.user.email });
    if (!user) throw new Error("کاربر یافت نشد");

    const order = new Order({
      user: user._id,
      items: validatedItems,
      subtotal,
      shippingFee,
      taxAmount,
      totalAmount,
      paymentMethod: orderData.paymentMethod || 'credit_card',
      shippingAddress,
      status: 'processing'
    });

    await order.save();
    await Cart.findOneAndUpdate(
      { userId: user._id },
      { $set: { products: [] } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "سفارش با موفقیت ثبت شد",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount
      }
    });

  } catch (error) {
    console.error("Order creation error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "خطا در ثبت سفارش"
    });
  }
}