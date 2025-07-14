import User from "@/models/user";
import connectDB from "@/lib/dbConnect";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await connectDB();

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const user = await User.findById(session.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { firstname, lastname, email } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { firstname, lastname, email, updatedAt: Date.now() },
        { new: true }
      ).select("-password");
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}