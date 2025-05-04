import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import Footer from "@/Components/Footer";
import { useEffect, useState, createContext } from "react";
// ! I imported createContext for AppContext!
export const AppContext = createContext();

export default function App({ Component, pageProps }) {
  const [isNavbar, setIsNavbar] = useState(false);
  // * These down states are like actions in Redux.
  const [addToCard, setAddToCard] = useState(0);
  const [addProduct, setAddProduct] = useState([]);
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      setIsNavbar(false);
    } else {
      setIsNavbar(true);
    }
  });

  // بارگذاری اولیه از localStorage
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

  // ذخیره‌سازی هنگام تغییر
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
        {isNavbar? (
          <NavbarAfterLogin />
        ) : (
          <NavbarBeforLogin />
        )}
        <div className="app">
          <Component {...pageProps} />
          {/* <Footer /> */}
        </div>
      </AppContext.Provider>
    </div>
  );
}


