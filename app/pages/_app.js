import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import Footer from "@/Components/Footer";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [isNavbar, setIsNavbar] = useState(false);
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      setIsNavbar(false);
    } else {
      setIsNavbar(true);
    }
  })
  return (
    <>
      {isNavbar? (
        <NavbarAfterLogin />
      ) : (
        <NavbarBeforLogin />
      )}
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
