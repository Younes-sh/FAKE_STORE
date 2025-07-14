import User from "@/models/user/index";
import connectDB from "@/lib/dbConnect";
// import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDB();

  if(req.method === "GET") {
    try {
        const users = await User.find({});
        return res.status(200).json({users});
    }catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}

  // const token = req.headers.authorization?.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ message: "Unauthorized" });
  // }

  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   const user = await User.findById(decoded.userId).select("-password");
    
  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }
    
  //   return res.status(200).json(user);
  // } catch (error) {
  //   return res.status(401).json({ message: "Invalid token" });
  // }
}