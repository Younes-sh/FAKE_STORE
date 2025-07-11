import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Image from "next/image";
import NavProfile from "./components/NavProfile/NavProfile";
import { useContext, useEffect } from "react";
import { AppContext } from "@/pages/_app";
import Script from "next/script";
import GEM from '@/public/asset/Logo/GEM.png';
import { usePathname } from "next/navigation";

export default function NavbarAfterLogin() {
  const { addToCard, setAddToCard } = useContext(AppContext); // ✅ گرفتن setter
  const pathname = usePathname();

//   // ✅ هربار Navbar لود شود، سبد خرید را بگیر و مقدار totalCount را آپدیت کن
//   useEffect(() => {
//     const fetchCartCount = async () => {
//       try {
//         const res = await fetch('/api/cart');
//         const data = await res.json();
//         const products = data.cart?.products || [];

//         // ✅ مجموع کل تعداد آیتم‌ها (حتی تکراری‌ها)
//         const totalCount = products.reduce((sum, item) => sum + item.count, 0);
//         setAddToCard(totalCount);
//       } catch (error) {
//         console.error("خطا در دریافت سبد خرید:", error);
//       }
//     };

//     fetchCartCount();
//   }, []);

  return (
    <div className={Style.navbar}>
      <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossOrigin="anonymous" />

      <div className="navbar-brand">
        <Link href="/">
          <Image src={GEM} alt="GEM" width={80} height={80} />
        </Link>
      </div>

      <nav className={`container ${Style.menuContainer}`}>
        <Link className={pathname === "/" ? Style.active : ""} href="/">Home</Link>
        <Link className={pathname === "/products" ? Style.active : ""} href="/products">Products</Link>
        <Link className={pathname === "/about" ? Style.active : ""} href="/about">About</Link>
        <Link className={pathname === "/contact" ? Style.active : ""} href="/contact">Contact</Link>
        <Link className={pathname === "/basket" ? Style.active : ""} href="/basket">
          <i className="fa-solid fa-basket-shopping"></i>
          {addToCard > 0 && <span className="badge">{addToCard}</span>}
        </Link>
      </nav>

      <div className="navbar-brand">
        <NavProfile />
      </div>
    </div>
  );
}
