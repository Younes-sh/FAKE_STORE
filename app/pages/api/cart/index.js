import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Cart from "@/models/cart";
import User from "@/models/User";

export default async function handler(req, res) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    console.error("User not found for email:", session.user.email);
    return res.status(404).json({ message: "User not found" });
  }

  if (req.method === "POST") {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Cart items are required" });
    }

    const newProduct = products[0];

    if (!newProduct._id || !newProduct.productName || !newProduct.price || !newProduct.count || !newProduct.totalPrice || !newProduct.image) {
      return res.status(400).json({ message: "Invalid product format" });
    }

    try {
      let cart = await Cart.findOne({ userId: user._id });

      if (!cart) {
        if (!user._id) {
          console.error("❌ Cannot create cart without valid userId");
          return res.status(500).json({ message: "Invalid user ID" });
        }

        console.log("🟢 user._id:", user._id);

        cart = await Cart.create({
          userId: user._id,
          products: [newProduct]
        });
      } else {
        const existingIndex = cart.products.findIndex(p => p._id.toString() === newProduct._id);

        if (existingIndex >= 0) {
          cart.products[existingIndex].count = newProduct.count;
          cart.products[existingIndex].totalPrice = newProduct.count * newProduct.price;
        } else {
          cart.products.push(newProduct);
        }

        await cart.save();
      }

      return res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error("❌ Error updating cart:", error);
      return res.status(500).json({ message: "Error updating cart" });
    }
  }

  if (req.method === "GET") {
    try {
      const cart = await Cart.findOne({ userId: user._id });
      return res.status(200).json({ cart });
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      return res.status(500).json({ message: "Failed to get cart" });
    }
  }

  if(req.method === "DELETE") {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    try {
      const cart = await Cart.findOne({ userId: user._id });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      cart.products = cart.products.filter(p => p._id.toString() !== productId);
      await cart.save();

      return res.status(200).json({ success: true, cart });
    } catch (error) {
      console.error("❌ Error deleting item from cart:", error);
      return res.status(500).json({ message: "Error deleting item from cart" });
    }

  }

  return res.status(405).json({ message: "Method not allowed" });
}
