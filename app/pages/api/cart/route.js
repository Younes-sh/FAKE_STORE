import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Cart from "@/models/cart";

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { productId, quantity } = await req.json();

  if (!productId || !quantity) {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  const existingItem = await Cart.findOne({ userEmail: session.user.email, productId });

  if (existingItem) {
    existingItem.quantity += quantity;
    await existingItem.save();
  } else {
    await Cart.create({ userEmail: session.user.email, productId, quantity });
  }

  return NextResponse.json({ message: "Product added to cart" }, { status: 200 });
}
