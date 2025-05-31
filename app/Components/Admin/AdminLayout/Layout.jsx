// components/AdminLayout.jsx
'use client';
import Link from "next/link";
import Style from "./styleLayout.module.css";
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // منتظر لود شدن session بمان
    if (!session || session.user.role !== "admin") {
      router.push("/"); // اگر کاربر admin نبود، به خانه منتقل کن
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Loading...</p>; // یا یک Spinner زیبا
  }

  if (!session || session.user.role !== "admin") {
    return null; // چیزی نمایش نده چون redirect انجام می‌شود
  }

  const links = [
    { href: "/younessheikhlar/", label: "Home" },
    { href: "/younessheikhlar/postProduct", label: "Post product" },
    { href: "/younessheikhlar/users", label: "Users" },
    { href: "/younessheikhlar/products", label: "Products" },
    { href: "/younessheikhlar/message", label: "Message" },
    { href: "/younessheikhlar/setting", label: "Setting" },
  ];

  return (
    <div className={Style.layout}>
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
        {/* محتوای پنل مدیریت */}
        {children}
      </main>
    </div>
  );
}
