import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { SessionProvider, useSession } from 'next-auth/react';
import { useState, createContext } from "react";

export const AppContext = createContext();

function Layout({ children }) {
  const { data: session, status } = useSession();

  return (
    <>
      {status === "loading" ? null : session ? (
        <NavbarAfterLogin />
      ) : (
        <NavbarBeforLogin />
      )}
      <div className="app">{children}</div>
    </>
  );
}

function AppContent({ Component, pageProps }) {
  // این state‌ها فقط برای نمایش بصری در UI استفاده می‌شوند
  const [addToCard, setAddToCard] = useState(0); // تعداد آیتم‌ها
  const [addProduct, setAddProduct] = useState([]); // لیست محصولات داخل کارت
  const [orders, setOrders] = useState([]); // سفارشات
  const { status } = useSession();
  
  return (
    <AppContext.Provider value={{
      addToCard, setAddToCard,
      addProduct, setAddProduct,
      orders, setOrders,
    }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}
