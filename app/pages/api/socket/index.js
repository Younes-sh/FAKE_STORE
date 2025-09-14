// pages/api/socket.js (یا app/api/socket/route.js)
import { Server } from 'socket.io';

export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Initializing Socket.IO server...');
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    // محدود کردن تعداد اتصالات برای جلوگیری از کندی
    maxHttpBufferSize: 1e6, // 1MB
    pingTimeout: 20000,
    pingInterval: 10000,
  });

  res.socket.server.io = io;

  // ذخیره سبد خرید در حافظه (برای تست محلی - در تولید از دیتابیس استفاده کنید)
  const carts = new Map(); // userId -> cart

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // join room با userId
    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
        // ارسال سبد خرید فعلی به کاربر
        const userCart = carts.get(userId) || [];
        socket.emit('cartUpdated', userCart);
      }
    });

    // دریافت سبد خرید
    socket.on('getCart', (userId) => {
      const userCart = carts.get(userId) || [];
      socket.emit('cartUpdated', userCart);
    });

    // افزودن به سبد خرید
    socket.on('addToCart', ({ userId, product }) => {
      if (userId && product) {
        const userCart = carts.get(userId) || [];
        userCart.push(product);
        carts.set(userId, userCart);
        // ارسال به‌روزرسانی به کاربر
        io.to(userId).emit('cartUpdated', userCart);
        console.log(`Cart updated for user ${userId}:`, userCart);
      }
    });

    // حذف یا به‌روزرسانی‌های دیگر (اختیاری)
    socket.on('user-updated', (data) => {
      console.log('User updated:', data);
      socket.broadcast.emit('user-update', data);
    });

    socket.on('user-delete', (data) => {
      console.log('User deleted:', data);
      socket.broadcast.emit('user-delete', data);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log('Socket.IO server initialized successfully');
  res.end();
}