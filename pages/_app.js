import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { SessionProvider, useSession } from "next-auth/react";
import { useState, createContext, useEffect } from "react";
import { signOut } from "next-auth/react";
import "../styles/globals.css";
import { CartProvider } from '@/contexts/CartContext';
import { Analytics } from '@vercel/analytics/next';


export const AppContext = createContext();
let socket;

function Layout({ children }) {
  const { data: session, status, update } = useSession();
  const [connected, setConnected] = useState(false);




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

  return (
    <AppContext.Provider
      value={{
        addToCard,
        setAddToCard,
        addProduct,
        setAddProduct,
        orders,
        setOrders,
      }}
    >
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <AppContent Component={Component} pageProps={pageProps} />
        <Analytics />
      </CartProvider>
    </SessionProvider>
  );
}
