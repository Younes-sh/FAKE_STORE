import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [addProduct, setAddProduct] = useState([]);
  const [addToCard, setAddToCard] = useState(0);

  // تابع بارگذاری مجدد سبد خرید از سرور
  const refreshCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setAddProduct(data.cart?.items || []);
      setAddToCard(data.cart?.items.reduce((acc, i) => acc + i.quantity, 0) || 0);
    } catch (err) {
      setAddProduct([]);
      setAddToCard(0);
    }
  };

  // بارگذاری اولیه یا هر وقت لازم بود
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <AppContext.Provider
      value={{
        addProduct,
        setAddProduct,
        addToCard,
        setAddToCard,
        refreshCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
