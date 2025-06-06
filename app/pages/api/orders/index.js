import connectDB from "@/lib/dbConnect";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const userId = session.user.id;

  if (req.method === "POST") {
    try {
      const { items, totalAmount, shippingAddress, paymentMethod } = req.body;
      const order = await Order.create({
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod,
        status: "completed",
      });
      return res.status(201).json({ order });
    } catch (err) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}