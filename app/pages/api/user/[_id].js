import User from "@/models/user/index";
import connectDB from "@/lib/dbConnect";
import { isValidObjectId } from "mongoose";

export default async function handler (req , res) {
    await connectDB();
    const {_id} = req.query;
    if(isValidObjectId(_id)) {
        if(req.method == "GET") {
            const user = await User.findById(_id)
            if(!user) return res.status(404).json({message: "user not found", data: null});
            else return res.status(200).json({message: "user", data: user});
        } 
        else if (req.method === "PUT") {
            const result = await User.findByIdAndUpdate(_id, req.body);
            if(!result) {
                res.status(404).json({message: "user not found", data: null})
            }
            else {
                res.status(200).json({ message: "user updated", data: result })
            }
        }
        else if (req.method === "DELETE") {
            const result = await User.findByIdAndDelete(_id);
            if(!result) {
                res.status(404).json({message: "user not found", data: null})
            }
            else {
                res.status(200).json({ message: "user deleted", data: null })
            }
        }
    }
}