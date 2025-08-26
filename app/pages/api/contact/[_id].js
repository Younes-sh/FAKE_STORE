import Contact from "@/models/contact";
import connectDB from "@/lib/dbConnect";
import { isValidObjectId } from "mongoose";

export default async function handler(req, res) {
  await connectDB();
  const { _id } = req.query;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({
      success: false,
      message: "شناسه پیام معتبر نیست",
    });
  }

  try {
    switch (req.method) {
      case "GET":
        const message = await Contact.findById(_id);
        if (!message) {
          return res.status(404).json({
            success: false,
            message: "پیام یافت نشد",
          });
        }
        return res.status(200).json({
          success: true,
          data: message,
        });

      case "PATCH":
        const updatedMessage = await Contact.findByIdAndUpdate(
          _id,
          req.body,
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          success: true,
          data: updatedMessage,
          message: "پیام با موفقیت بروزرسانی شد",
        });

      case "DELETE":
        await Contact.findByIdAndDelete(_id);
        return res.status(200).json({
          success: true,
          message: "پیام با موفقیت حذف شد",
        });

      default:
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`,
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطای سرور داخلی",
      error: error.message,
    });
  }
}