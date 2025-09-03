// hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';

export const useCart = () => {
  const { data: session } = useSession();
  const [cart, setCart] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // تابع برای گرفتن سبد خرید
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', {
        credentials: 'include'
      });
      
      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
        return data.cart;
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    return null;
  }, []);

  // تابع برای افزودن محصول به سبد خرید
  const addToCart = useCallback(async (product) => {
    if (!session) return false;

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          products: [{
            ...product,
            count: 1,
            totalPrice: product.price
          }]
        })
      });

      if (response.ok) {
        const updatedCart = await fetchCart();
        
        // emit event به سرور برای به روزرسانی سایر کلاینت‌ها
        if (socket && session?.user?.id) {
          socket.emit('cart-updated', {
            userId: session.user.id,
            cart: updatedCart
          });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }, [session, socket, fetchCart]);

  // تنظیم Socket.io connection
  useEffect(() => {
    if (!session?.user?.id) return;

    const newSocket = io({
      path: '/api/socket',
      addTrailingSlash: false
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Connected to server');
      newSocket.emit('join-cart', session.user.id);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('❌ Disconnected from server');
    });

    newSocket.on('cart-updated', (data) => {
      console.log('🔄 Cart updated via socket:', data);
      setCart(data.cart);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [session]);

  // لود اولیه سبد خرید
  useEffect(() => {
    if (session) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [session, fetchCart]);

  return {
    cart,
    isConnected,
    addToCart,
    fetchCart,
    isLoading: cart === null && session !== null
  };
};