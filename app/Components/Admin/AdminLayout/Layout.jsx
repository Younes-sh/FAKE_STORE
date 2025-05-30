import Link from "next/link";
import Style from "./styleLayout.module.css";
import { usePathname } from 'next/navigation';

export default function AdminLayout({children}) {
    const pathname = usePathname();
    const links = [
        { href: "/younessheikhlar/", label: "Home" },
        { href: "/younessheikhlar/postProduct", label: "Post product" },
        { href: "/younessheikhlar/users", label: "Users" },
        { href: "/younessheikhlar/products", label: "Products" },
        { href: "/younessheikhlar/message", label: "Message" },
        { href: "/younessheikhlar/setting", label: "Setting" },
    ];

  return (
    <div className={` ${Style.layout}`}>
        <nav>
            <div className={Style.fixedPosition}>
            <ul className={Style.positionFixed}>
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link 
                                href={link.href}
                                className={`${pathname === link.href ? Style.active : ""}`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
        <main>
            {/* Admin content */}
            {children}
        </main>
    </div>
  )
}
