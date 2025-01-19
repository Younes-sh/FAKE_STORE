import Style from "./navbarAfterLogin.module.css";
import Link from "next/link";
import Basket from '@/public/basket.png'
import Image from "next/image";
import User from "@/public/user.png"

export default function NavbarAfterLogin () {
    return (
        <div className={Style.navbar}>

            <div className="navbar-brand">
                <Link href="/">Fake Store</Link>
            </div>

            <nav className={`container ${Style.menuContainer}`}>
                
                <Link href="/product">Products</Link>
                <Link href="/orders">Orders</Link>
                <Link href="/basket">
                    <Image src={Basket} alt="Basket" width={20} height={20}/>
                    <span className="badge">17{/* TODO: Get basket count */}</span>
                </Link>
            </nav>

            <div className="navbar-brand">
                <Link href="/">
                    <Image src={User} alt="Image" width={30} height={30} />
                </Link>
            </div>
        </div>
    )
}