// Components/Navbar/NavbarAfterLogin.jsx
import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Image from "next/image";
import NavProfile from "./components/NavProfile/NavProfile";
import { useState, useEffect } from "react";
import Script from "next/script";
import GEM from '../../public/asset/Logo/GEM.png';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from '@/contexts/CartContext';

export default function NavbarAfterLogin() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 🔹 استفاده از CartContext
  const { cartCount, loading: isLoading, fetchCart } = useCart();
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCart(); // هر بار cartUpdated بیاد، دوباره state رو بگیر
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCart]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const handleNavClick = () => {
    if (window.innerWidth < 992) closeMenu();
  };

  return (
    <div className={Style.navbar}>
      <Script 
        src="https://kit.fontawesome.com/24d3f7dfbb.js" 
        crossOrigin="anonymous" 
        strategy="lazyOnload"
      />

      <button 
        className={Style.menuButton} 
        onClick={toggleMenu}
        aria-label="منو"
      >
        <i className="fas fa-bars"></i>
      </button>

      <div className={Style.Logo}>
        <Link href="/" onClick={closeMenu}>
          <Image src={GEM} alt="GEM" width={80} height={80} priority />
        </Link>
      </div>

      <nav className={`${Style.menuContainer} ${isMenuOpen ? Style.menuOpen : ''}`}>
        <Link className={`${Style.navLink} ${pathname === "/" ? Style.active : ""}`} href="/" onClick={handleNavClick}>Home</Link>
        <Link className={`${Style.navLink} ${pathname === "/products" ? Style.active : ""}`} href="/products" onClick={handleNavClick}>Products</Link>
        <Link className={`${Style.navLink} ${pathname === "/about" ? Style.active : ""}`} href="/about" onClick={handleNavClick}>About</Link>
        <Link className={`${Style.navLink} ${pathname === "/contact" ? Style.active : ""}`} href="/contact" onClick={handleNavClick}>Contact</Link>
        
        {/* سبد خرید در موبایل */}
        <Link className={`${Style.cartLink} ${pathname === "/basket" ? Style.active : ""}`} href="/basket" onClick={handleNavClick}>
          <i className="fa-solid fa-basket-shopping"></i>
          {cartCount > 0 && <span className={Style.badge}>{cartCount}</span>}
          {isLoading && <span className={Style.loadingDot}>...</span>}
        </Link>
      </nav>

      <div className={Style.rightSection}>
        {/* سبد خرید در دسکتاپ */}
        <Link className={`${Style.desktopCart} ${pathname === "/basket" ? Style.active : ""}`} href="/basket">
          <i className="fa-solid fa-basket-shopping"></i>
          {cartCount > 0 && <span className={Style.badge}>{cartCount}</span>}
          {isLoading && <span className={Style.loadingDot}>...</span>}
        </Link>
        
        <NavProfile onProfileClick={closeMenu} />
      </div>

      <button className={Style.floatingMenuBtn} onClick={toggleMenu} aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}>
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {isMenuOpen && <div className={Style.overlay} onClick={closeMenu} />}

      <style jsx>{`
        .loadingDot {
          font-size: 12px;
          color: #666;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
