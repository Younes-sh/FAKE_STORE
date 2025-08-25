import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "editor") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  // Fetch editor-specific data from the database
  const editorStats = [
    { name: 'Articles', articles: 24, reviews: 15 },
    { name: 'News', articles: 18, reviews: 12 },
    { name: 'Blog', articles: 10, reviews: 8 },
  ];
  
  res.status(200).json(editorStats);
}