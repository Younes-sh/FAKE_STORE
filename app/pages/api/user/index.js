import User from "@/models/User/index";
import connectDB from "@/lib/dbConnect";


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
}