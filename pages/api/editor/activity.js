import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== "editor") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  // Fetch editor activity data from the database
  const activityData = [
    { date: '2025/01/01', published: 5, draft: 2 },
    { date: '2025/01/02', published: 3, draft: 4 },
    { date: '2025/01/03', published: 7, draft: 1 },
    { date: '2025/01/04', published: 2, draft: 3 },
    { date: '2025/01/05', published: 6, draft: 2 },
  ];
  
  res.status(200).json(activityData);
}