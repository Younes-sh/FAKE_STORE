import Style from "./navbarBeforLogin.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import GEM from '@/public/asset/Logo/GEM.png';

export default function Navbar () {

    const router = useRouter();
    const loginPage = () => {
        router.push('/login');
    }
    
        

    return (
        <div className={Style.navContainer}>

            <nav className={`  container ${Style.navbar}`}>
                {/* Logo */}
                <h1>
                    <Link href="/">
                        <Image src={GEM} alt="GEM" width={80} height={80} />
                    </Link>
                </h1>

                {/* Menue */}
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/products">Product</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                </ul>
                {/* Login */}
                <button onClick={loginPage} className={Style.loginBtn}>Login</button>
            </nav>
        </div>
    )
}