import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import Footer from "@/Components/Footer";
import { SessionProvider, useSession  } from 'next-auth/react';
import { useEffect, useState, createContext } from "react";

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

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [addToCard, setAddToCard] = useState(0);
  const [addProduct, setAddProduct] = useState([]);
  const [orders, setOrders] = useState([]); // اضافه کردن state سفارشات

  useEffect(() => {
    const storedProducts = localStorage.getItem("cartProducts");
    const storedCount = localStorage.getItem("cartCount");
    const storedOrders = localStorage.getItem("userOrders"); // بارگذاری سفارشات از localSto

    if (storedProducts) {
      setAddProduct(JSON.parse(storedProducts));
    }
    if (storedCount) {
      setAddToCard(parseInt(storedCount));
    }
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(addProduct));
    localStorage.setItem("cartCount", addToCard.toString());
    localStorage.setItem("userOrders", JSON.stringify(orders)); // Save orders in localSto
  }, [addProduct, addToCard, orders]);

  return (
    <div className="appContainer">
      <AppContext.Provider value={{
        addToCard, setAddToCard,
        addProduct, setAddProduct,
        orders, setOrders, // Add orders to context
        // addNewOrder // Add custom function
      }}>
       
        <div className="app">
          <SessionProvider session={session}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SessionProvider>
          {/* <Footer /> */}
        </div>
      </AppContext.Provider>
    </div>
  );
}