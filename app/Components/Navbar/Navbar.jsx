import Style from "./navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Navbar () {

    const router = useRouter();
    const loginPage = () => {
        router.push('/auth/login');
    }
    
        

    return (
        <div className={Style.navContainer}>

            <nav className={`  container ${Style.navbar}`}>
                {/* Logo */}
                <h1>Fake Store</h1>

                {/* Menue */}
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
                {/* Login */}
                <button onClick={loginPage} className={Style.loginBtn}>Login</button>
            </nav>
        </div>
    )
}