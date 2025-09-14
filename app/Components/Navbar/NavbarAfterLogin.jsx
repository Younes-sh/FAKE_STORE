// Components/Navbar/NavbarAfterLogin.jsx
import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Image from "next/image";
import NavProfile from "./components/NavProfile/NavProfile";
import { useEffect, useState } from "react";
import Script from "next/script";
import GEM from '../../public/asset/Logo/GEM.png';
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NavbarAfterLogin() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // تابع برای دریافت تعداد محصولات در سبد خرید
  // تابع برای دریافت تعداد محصولات در سبد خرید
const fetchCartCount = async () => {
  if (!session?.user?.id) {
    setCartCount(0);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);
  try {
    const res = await fetch('/api/cart');
    if (!res.ok) {
      throw new Error(`Failed to fetch cart: ${res.status}`);
    }
    const data = await res.json();
    
    // تغییر: تعداد محصولات مختلف (نه تعداد کل آیتم‌ها)
    const uniqueProductsCount = data.cart?.products?.length || 0;
    
    setCartCount(uniqueProductsCount);
  } catch (error) {
    console.error('Error fetching cart count:', error);
    setCartCount(0);
  } finally {
    setIsLoading(false);
  }
};

  // دریافت اولیه تعداد محصولات
  useEffect(() => {
    fetchCartCount();
  }, [session?.user?.id]);

  // گوش دادن به رویدادهای به‌روزرسانی سبد خرید
  useEffect(() => {
    const handleCartUpdate = () => {
      console.log('🛒 Cart update event received in Navbar');
      fetchCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = () => {
    if (window.innerWidth < 992) {
      closeMenu();
    }
  };

  return (
    <div className={Style.navbar}>
      <Script 
        src="https://kit.fontawesome.com/24d3f7dfbb.js" 
        crossOrigin="anonymous" 
        strategy="lazyOnload"
      />

      {/* دکمه منو در موبایل */}
      <button 
        className={Style.menuButton} 
        onClick={toggleMenu}
        aria-label="منو"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* لوگو */}
      <div className={Style.Logo}>
        <Link href="/" onClick={closeMenu}>
          <Image 
            src={GEM} 
            alt="GEM" 
            width={80} 
            height={80} 
            priority
          />
        </Link>
      </div>

      {/* منوی اصلی */}
      <nav className={`${Style.menuContainer} ${isMenuOpen ? Style.menuOpen : ''}`}>
        <Link 
          className={`${Style.navLink} ${pathname === "/" ? Style.active : ""}`} 
          href="/" 
          onClick={handleNavClick}
        >
          Home
        </Link>
        <Link 
          className={`${Style.navLink} ${pathname === "/products" ? Style.active : ""}`} 
          href="/products" 
          onClick={handleNavClick}
        >
          Products
        </Link>
        <Link 
          className={`${Style.navLink} ${pathname === "/about" ? Style.active : ""}`} 
          href="/about" 
          onClick={handleNavClick}
        >
          About
        </Link>
        <Link 
          className={`${Style.navLink} ${pathname === "/contact" ? Style.active : ""}`} 
          href="/contact" 
          onClick={handleNavClick}
        >
          Contact
        </Link>
        
        {/* سبد خرید در منوی موبایل */}
        <Link 
          className={`${Style.cartLink} ${pathname === "/basket" ? Style.active : ""}`} 
          href="/basket"
          onClick={handleNavClick}
        >
          <i className="fa-solid fa-basket-shopping"></i>
          {cartCount > 0 && <span className={Style.badge}>{cartCount}</span>}
          {isLoading && <span className={Style.loadingDot}>...</span>}
        </Link>
      </nav>

      {/* بخش راست (پروفایل + سبد خرید در دسکتاپ) */}
      <div className={Style.rightSection}>
        {/* سبد خرید در دسکتاپ */}
        <Link 
          className={`${Style.desktopCart} ${pathname === "/basket" ? Style.active : ""}`} 
          href="/basket"
        >
          <i className="fa-solid fa-basket-shopping"></i>
          {cartCount > 0 && <span className={Style.badge}>{cartCount}</span>}
          {isLoading && <span className={Style.loadingDot}>...</span>}
        </Link>
        
        <NavProfile onProfileClick={closeMenu} />
      </div>

      {/* دکمه شناور برای موبایل */}
      <button 
        className={Style.floatingMenuBtn}
        onClick={toggleMenu}
        aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
      >
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* overlay برای بستن منو با کلیک خارج */}
      {isMenuOpen && (
        <div 
          className={Style.overlay}
          onClick={closeMenu}
        />
      )}

      {/* استایل برای loading indicator */}
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