// contexts/CartContext.js
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session } = useSession();

  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // محاسبه تعداد محصولات مختلف (نه تعداد کل آیتم‌ها)
  const calculateUniqueProductsCount = (cartData) => {
    if (!cartData?.products || !Array.isArray(cartData.products)) return 0;
    
    // تعداد محصولات مختلف = طول آرایه products
    return cartData.products.length;
  };

  // -----------------------
  // Fetch cart from API
  // -----------------------
  const fetchCart = async () => {
    if (!session?.user?.id) {
      setCart({ products: [] });
      setCartCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }
      
      const data = await res.json().catch(() => ({}));
      const cartData = data.cart || { products: [] };
      
      setCart(cartData);
      
      // 🔥 تغییر: تعداد محصولات مختلف، نه تعداد کل آیتم‌ها
      const uniqueProductsCount = calculateUniqueProductsCount(cartData);
      setCartCount(uniqueProductsCount);
      
    } catch (err) {
      console.error("CartContext.fetchCart error:", err);
      setCart({ products: [] });
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  // یکبار در mount و هر بار که session تغییر کند - fetch کن
  useEffect(() => {
    fetchCart();
  }, [session?.user?.id]);

  // گوش دادن به event عمومی
  useEffect(() => {
    const handler = () => {
      console.log("🔄 CartContext: Received cartUpdated event, refetching...");
      fetchCart();
    };
    
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, [session?.user?.id]);

  // -----------------------
  // Helpers / actions
  // -----------------------

  const isProductInCart = (productId) => {
    if (!productId || !cart?.products) return false;
    const pid = productId.toString();
    return cart.products.some((p) => (p._id || "").toString() === pid);
  };

  const addToCart = async (product) => {
    if (!session?.user?.id) return false;

    if (!product?.productId) {
      console.error("addToCart: productId is missing", product);
      return false;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to add to cart: ${res.status} - ${errorText}`);
      }

      // فوراً cart را refresh کن
      await fetchCart();
      
      // رویداد global را dispatch کن
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      
      console.log("✅ Product added to cart, count updated");
      return true;
    } catch (error) {
      console.error("❌ addToCart error:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, count) => {
    if (!session?.user?.id) return false;
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, count }),
      });
      
      if (!res.ok) return false;
      
      // 🔥 تغییر: فقط cart را refresh کن اما cartCount تغییر نمی‌کند
      // چون تعداد محصولات مختلف تغییری نکرده
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      
      console.log("✅ Quantity updated, cart refreshed");
      return true;
    } catch (err) {
      console.error("updateQuantity error:", err);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!session?.user?.id) return false;
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      
      if (!res.ok) return false;
      
      // فوراً cart را refresh کن
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      
      return true;
    } catch (err) {
      console.error("removeFromCart error:", err);
      return false;
    }
  };

  const clearCart = async () => {
    if (!session?.user?.id) return false;
    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      if (!res.ok) return false;
      await fetchCart();
      window.dispatchEvent(new CustomEvent("cartUpdated"));
      return true;
    } catch (err) {
      console.error("clearCart error:", err);
      return false;
    }
  };

  // -----------------------
  // Provider value
  // -----------------------
  const value = {
    cart,
    cartCount, // 🔥 این حالا تعداد محصولات مختلف است
    loading,
    fetchCart,
    isProductInCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    // اضافه کردن تابع کمکی برای محاسبه تعداد کل آیتم‌ها اگر نیاز بود
    getTotalItemsCount: () => {
      if (!cart?.products) return 0;
      return cart.products.reduce((total, item) => total + (item.count || 0), 0);
    }
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}