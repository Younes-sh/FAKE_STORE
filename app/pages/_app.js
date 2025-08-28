import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { SessionProvider, useSession } from "next-auth/react";
import { useState, createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { signOut } from "next-auth/react";
import "../styles/globals.css";


export const AppContext = createContext();
let socket;

function Layout({ children }) {
  const { data: session, status, update } = useSession();
  const [connected, setConnected] = useState(false);


useEffect(() => {
  if (!session?.user?.id) return;
  if (!socket) socket = io({ path: `${process.env.NEXT_PUBLIC_APP_URL}/api/socket` });

  if (!connected) {
    socket.emit("join", session.user.id);
    setConnected(true);
  }

  socket.on("role-changed", async () => {
    console.log("Role changed, updating session...");
    await update();
  });

  socket.on("user-delete", (data) => {
    if (data._id === session.user.id) {
      // حذف کاربر → ساین اوت اجباری
      signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login` });
    }
  });

  return () => {
    socket.off("role-changed");
    socket.off("user-delete");
  };
}, [session, update, connected]);


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
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}
