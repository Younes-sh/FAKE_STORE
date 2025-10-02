import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { SessionProvider, useSession } from "next-auth/react";
import { useState, createContext, useEffect, useMemo } from "react";
import { CartProvider } from '@/contexts/CartContext';
import { Analytics } from '@vercel/analytics/next';

export const AppContext = createContext();

function Layout({ children }) {
  const { data: session, status } = useSession();

  const renderNavbar = () => {
    if (status === "loading") return <NavbarBeforLogin />;
    return session ? <NavbarAfterLogin /> : <NavbarBeforLogin />;
  };

  return (
    <>
      {renderNavbar()}
      <div className="app">{children}</div>
    </>
  );
}

function AppContent({ Component, pageProps }) {
  const [addToCard, setAddToCard] = useState(0);
  const [addProduct, setAddProduct] = useState([]);
  const [orders, setOrders] = useState([]);

  // استفاده از useMemo برای بهینه‌سازی performance
  const contextValue = useMemo(() => ({
    addToCard,
    setAddToCard,
    addProduct,
    setAddProduct,
    orders,
    setOrders,
  }), [addToCard, addProduct, orders]);

  return (
    <AppContext.Provider value={contextValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default function App({ Component, pageProps }) {
  // جدا کردن session از pageProps به درستی
  const { session, ...otherPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <CartProvider>
        <AppContent Component={Component} pageProps={otherPageProps} />
        <Analytics />
      </CartProvider>
    </SessionProvider>
  );
}