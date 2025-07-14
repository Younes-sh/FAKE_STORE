import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const order = await Order.findOne({
      $or: [
        { _id: id },
        { orderNumber: id }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "سفارش یافت نشد" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "خطا در دریافت سفارش" });
  }
}