import Style from "./navbar.module.css";
import Link from "next/link";

export default function Navbar () {
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
                <button className={Style.loginBtn}>Login</button>
            </nav>
        </div>
    )
}