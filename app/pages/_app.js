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


  useEffect(() => {
    const storedProducts = localStorage.getItem("cartProducts");
    const storedCount = localStorage.getItem("cartCount");

    if (storedProducts) {
      setAddProduct(JSON.parse(storedProducts));
    }
    if (storedCount) {
      setAddToCard(parseInt(storedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartProducts", JSON.stringify(addProduct));
    localStorage.setItem("cartCount", addToCard.toString());
  }, [addProduct, addToCard]);

  return (
    <div className="appContainer">
      <AppContext.Provider value={{
        addToCard, setAddToCard,
        addProduct, setAddProduct
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