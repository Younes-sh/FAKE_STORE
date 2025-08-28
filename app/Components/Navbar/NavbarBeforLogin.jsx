import Style from "./navbarBeforLogin.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import GEM from '../../public/asset/Logo/GEM.png';
import { useState, useEffect } from "react";

export default function Navbar() {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const loginPage = () => {
        router.push('/login');
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

   useEffect(() => {
  setIsMounted(true);
  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);

if (!isMounted) return null;

    return (
        <div className={`${Style.navContainer} ${isScrolled ? Style.scrolled : ''}`}>
            <nav className={`container ${Style.navbar}`}>
                {/* Logo */}
                <div className={Style.logoContainer}>
                    <Link href="/">
                        <Image src={GEM} alt="GEM" width={80} height={80} />
                    </Link>
                </div>

                {/* Hamburger Menu Icon */}
                <div className={Style.hamburger} onClick={toggleMenu}>
                    <div className={`${Style.line} ${isMenuOpen ? Style.line1 : ''}`}></div>
                    <div className={`${Style.line} ${isMenuOpen ? Style.line2 : ''}`}></div>
                    <div className={`${Style.line} ${isMenuOpen ? Style.line3 : ''}`}></div>
                </div>

                {/* Menue */}
                <ul className={`${Style.navLinks} ${isMenuOpen ? Style.active : ''}`}>
                    <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                    <li><Link href="/products" onClick={() => setIsMenuOpen(false)}>Product</Link></li>
                    <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
                    <li><Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
                </ul>
                
                {/* Login */}
                <button onClick={loginPage} className={Style.loginBtn}>Login</button>
            </nav>
        </div>
    )
}