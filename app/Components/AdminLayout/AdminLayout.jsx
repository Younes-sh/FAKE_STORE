import Link from "next/link";
import Style from "./styleLayout.module.css";

export default function AdminLayout({children}) {
  return (
    <div className={Style.layout}>
        <nav>
            <div className={Style.fixedPosition}>
                <ul>
                    <li>
                        <Link href="/younessheikhlar/postProduct">Post product</Link>
                    </li>
                    <li>
                        <Link href="/younessheikhlar/users">Users</Link>
                    </li>
                    <li>
                        <Link href="/younessheikhlar/products">Products</Link>
                    </li>
                </ul>
            </div>
        </nav>
        <main>
            {/* Admin content */}
            <input placeholder="Search"/>
            {children}
        </main>
    </div>
  )
}
