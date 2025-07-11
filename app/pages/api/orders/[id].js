// pages/api/orders/[id].js
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order";

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const order = await Order.findOne({ orderNumber: id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order" });
  }
}
