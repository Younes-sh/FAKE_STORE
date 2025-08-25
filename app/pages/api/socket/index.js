import { Server } from "socket.io";

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Initializing Socket.IO server...");

  const io = new Server(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // join room با userId برای ارسال اختصاصی رویدادها
    socket.on("join", (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
      }
    });

    // broadcast عمومی (اختیاری)
    socket.on("user-updated", (data) => {
      console.log("User updated:", data);
      socket.broadcast.emit("user-update", data);
    });

    socket.on("user-delete", (data) => {
      console.log("User deleted:", data);
      socket.broadcast.emit("user-delete", data);
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO server initialized successfully");
  res.end();
}
