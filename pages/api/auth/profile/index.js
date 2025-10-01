import { getServerSession } from "next-auth/next";
import { authOptions } from "../[...nextauth].js";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "GET") {
      return res.status(200).json(session.user);
    }
    
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Profile API error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}