import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { useSession } from "next-auth/react";
import Footer from "@/Components/Footer";
import Style from "./layout.module.css"; // فرض می‌کنیم این فایل استایل رو داره

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  // اگر سشن هنوز در حال بارگذاری است، چیزی نشان نده
  if (status === "loading") {
    return null; // یا می‌تونی یک لودر نمایش بدی
  }

  return (
    <div className={Style.layout}>
      {session ? <NavbarAfterLogin /> : <NavbarBeforLogin />}
      <main className={Style.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
