import User from "@/models/user/index";
import connectDB from "@/lib/dbConnect";
import { isValidObjectId } from "mongoose";

let io;

function getIO(req) {
  if (!io && req.socket.server.io) {
    io = req.socket.server.io;
  }
  return io;
}

export default async function handler(req, res) {
  await connectDB();
  const { _id } = req.query;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({
      success: false,
      message: "شناسه کاربر معتبر نیست",
      data: null,
    });
  }

  try {
    switch (req.method) {
      case "GET":
        return await handleGetRequest(_id, res);

      case "PUT":
        return await handlePutRequest(_id, req, res);

      case "PATCH":
        return await handlePatchRequest(_id, req, res);

      case "DELETE":
        return await handleDeleteRequest(_id, req, res);

      default:
        res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: `Method ${req.method} Not Allowed`,
          data: null,
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      success: false,
      message: "خطای سرور داخلی",
      data: null,
    });
  }
}

/* -------------------------
   GET => گرفتن یک کاربر
-------------------------- */
async function handleGetRequest(_id, res) {
  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "کاربر یافت نشد",
      data: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "کاربر یافت شد",
    data: user,
  });
}

/* -------------------------
   PUT => بروزرسانی کل اطلاعات کاربر
-------------------------- */
async function handlePutRequest(_id, req, res) {
  try {
    const { role, ...rest } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربر یافت نشد",
        data: null,
      });
    }

    if (role) user.role = role;
    Object.assign(user, rest);

    const updatedUser = await user.save();

    const ioInstance = getIO(req);
    if (ioInstance) {
      // اطلاع همه کاربران از تغییرات عمومی
      ioInstance.emit("user-update", updatedUser);
      // اطلاع خود کاربر از تغییر role بدون نیاز به refresh
      if (role) ioInstance.to(_id).emit("role-changed", { newRole: updatedUser.role });
    }

    return res.status(200).json({
      success: true,
      message: "اطلاعات کاربر با موفقیت بروزرسانی شد",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in PUT:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در بروزرسانی کاربر",
      data: null,
    });
  }
}

/* -------------------------
   PATCH => بروزرسانی بخشی از اطلاعات
-------------------------- */
async function handlePatchRequest(_id, req, res) {
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(_id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "کاربر یافت نشد",
      data: null,
    });
  }

  const ioInstance = getIO(req);
  if (ioInstance) {
    ioInstance.emit("user-update", updatedUser);
    if (updates.role) ioInstance.to(_id).emit("role-changed", { newRole: updatedUser.role });
  }

  return res.status(200).json({
    success: true,
    message: "بخشی از اطلاعات کاربر بروزرسانی شد",
    data: updatedUser,
  });
}

/* -------------------------
   DELETE => حذف کاربر
-------------------------- */
async function handleDeleteRequest(_id, req, res) {
  try {
    const userToDelete = await User.findById(_id);

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "کاربر یافت نشد",
        data: null,
      });
    }

    const deleteResult = await User.deleteOne({ _id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "کاربر یافت نشد",
        data: null,
      });
    }

    const ioInstance = getIO(req);
    if (ioInstance) {
      ioInstance.emit("user-delete", {
        _id,
        email: userToDelete.email,
        username: userToDelete.username,
      });
    }

    return res.status(200).json({
      success: true,
      message: "کاربر با موفقیت حذف شد",
      data: null,
    });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return res.status(500).json({
      success: false,
      message: "خطا در حذف کاربر",
      data: null,
    });
  }
}
