import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Basket from '@/public/basket.png'
import Image from "next/image";
import User from "@/public/user.png";
import NavProfile from "./components/NavProfile/NavProfile";
import {useContext} from "react";
import {AppContext} from "@/pages/_app";
import Script from "next/script";
import GEM from '@/public/asset/Logo/GEM.png';
import { usePathname } from "next/navigation";

export default function NavbarAfterLogin () {
    const {addToCard} = useContext(AppContext);
    const pathname = usePathname();

    return (
        <div className={Style.navbar}>
            <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossorigin="anonymous"></Script>

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
                    {/* <Image src={Basket} alt="Basket" width={20} height={20}/> */}
                    <i class="fa-solid fa-basket-shopping"></i>
                    {addToCard > 0 ? (<span className="badge">
                        {addToCard}
                        {/* TODO: Get basket count */}
                        </span>) : ('') }
                        
                </Link>
            </nav>

            <div className="navbar-brand">
                <NavProfile/>
            </div>
        </div>
    )
}