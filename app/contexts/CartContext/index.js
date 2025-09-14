// contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session } = useSession();
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = async () => {
    if (!session?.user?.id) {
      setCart({ products: [] });
      setCartCount(0);
      setLoading(false);
      return;
    }
  
    setLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        console.log('🛒 Cart data fetched:', data.cart);
        setCart(data.cart || { products: [] });
        
        // تغییر: تعداد محصولات مختلف (نه تعداد کل آیتم‌ها)
        const uniqueProductsCount = data.cart?.products?.length || 0;
        setCartCount(uniqueProductsCount);
      } else {
        console.error('❌ Failed to fetch cart:', res.status);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ products: [] });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCart();
  }, [session?.user?.id]);

  // گوش دادن به رویدادهای به‌روزرسانی سبد خرید
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('🔄 Cart update event received');
      fetchCart();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const isProductInCart = (productId) => {
    if (!productId) return false;
    
    const productIdStr = productId.toString();
    return cart.products.some(item => {
      const itemIdStr = item._id?.toString();
      return itemIdStr === productIdStr;
    });
  };

  const addToCart = async (product) => {
    if (!session?.user?.id) return false;
  
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });
      
      if (res.ok) {
        // به‌روزرسانی فوری وضعیت local
        const updatedRes = await fetch('/api/cart');
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setCart(data.cart || { products: [] });
          
          // محاسبه تعداد کل محصولات
          const totalCount = data.cart?.products?.reduce((sum, item) => sum + (item.count || 1), 0) || 0;
          setCartCount(totalCount);
        }
        
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  };
  //  Increase Quantity
  const increaseQuantity = async (productId) => {
    if (!session?.user?.id) return false;
  
    try {
      const res = await fetch('/api/cart/increase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        // فقط cart را به‌روزرسانی کنیم اما cartCount را تغییر ندهیم
        const updatedRes = await fetch('/api/cart');
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setCart(data.cart || { products: [] });
          // نکته: cartCount تغییر نمی‌کند چون تعداد محصولات یکسان است
        }
        
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error increasing quantity:', error);
      return false;
    }
  };
  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      cartCount,
      fetchCart, 
      isProductInCart,
      addToCart,
      increaseQuantity,
      setCartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};