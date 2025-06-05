import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const { data: session, status } = useSession();

  // اگر سشن هنوز در حال بارگذاری است، چیزی نشان نده
  if (status === "loading") {
    return null; // یا می‌تونی یک لودر نمایش بدی
  }

  return (
    <>
      {session ? <NavbarAfterLogin /> : <NavbarBeforLogin />}
      <div className="app">
        {children}
      </div>
    </>
  );
}
