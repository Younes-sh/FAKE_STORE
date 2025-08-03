import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Image from "next/image";
import NavProfile from "./components/NavProfile/NavProfile";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/pages/_app";
import Script from "next/script";
import GEM from '@/public/asset/Logo/GEM.png';
import { usePathname } from "next/navigation";

export default function NavbarAfterLogin() {
  const { addToCard, setAddToCard } = useContext(AppContext);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setAddToCard(data.cart?.products?.length || 0);
      } catch (error) {
        console.error("خطا در دریافت سبد خرید:", error);
      }
    };

    fetchCartCount();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className={Style.navbar}>
      <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossOrigin="anonymous" />

      {/* بخش چپ (منو در موبایل) */}
      <button className={Style.menuButton} onClick={toggleMenu}>
        <i className="fas fa-bars"></i>
      </button>

      {/* لوگو */}
      <div className={Style.Logo}>
        <Link href="/" onClick={() => setIsMenuOpen(false)}>
          <Image src={GEM} alt="GEM" width={80} height={80} />
        </Link>
      </div>

      {/* منوی اصلی */}
      <nav className={`${Style.menuContainer} ${isMenuOpen ? Style.menuOpen : ''}`}>
        <Link className={pathname === "/" ? Style.active : ""} href="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
        <Link className={pathname === "/products" ? Style.active : ""} href="/products" onClick={() => setIsMenuOpen(false)}>Products</Link>
        <Link className={pathname === "/about" ? Style.active : ""} href="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
        <Link className={pathname === "/contact" ? Style.active : ""} href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
        <Link className={`${Style.cartLink} ${pathname === "/basket" ? Style.active : ""}`} href="/basket">
          <i className="fa-solid fa-basket-shopping"></i>
          {addToCard > 0 && <span className={Style.badge}>{addToCard}</span>}
        </Link>
      </nav>

      {/* بخش راست (پروفایل + سبد خرید) */}
      <div className={Style.rightSection}>
        <NavProfile />
      </div>

      {/* دکمه شناور برای موبایل */}
      <button 
        className={Style.floatingMenuBtn}
        onClick={toggleMenu}
      >
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>
    </div>
  );
}