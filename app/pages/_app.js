// _app.js
import "@/styles/globals.css";
import NavbarBeforLogin from "@/Components/Navbar/NavbarBeforLogin";
import NavbarAfterLogin from "@/Components/Navbar/NavbarAfterLogin";
import { SessionProvider, useSession } from 'next-auth/react'; // useSession اینجا هم لازم است
import { useState, createContext } from "react";

export const AppContext = createContext();

// کامپوننت Layout
function Layout({ children }) {
  const { data: session, status } = useSession(); // دوباره از useSession استفاده می کنیم

  // این تابع تصمیم می گیرد که کدام Navbar نمایش داده شود
  const renderNavbar = () => {
    if (status === "loading") {
      // در زمان بارگذاری (شامل SSR اولیه), می توانید یک نوبار پیش فرض یا null برگردانید.
      // مهم است که این وضعیت در SSR و CSR سازگار باشد.
      // برای رفع مشکل فعلی، می توانیم فرض کنیم تا زمانی که سشن لود نشده، کاربر لاگین نیست.
      return <NavbarBeforLogin />; // یا null اگر نمی خواهید چیزی در زمان لودینگ نمایش دهید
    } else if (session) {
      return <NavbarAfterLogin />;
    } else {
      return <NavbarBeforLogin />;
    }
  };

  return (
    <>
      {renderNavbar()} {/* فراخوانی تابع برای نمایش نوبار */}
      <div className="app">{children}</div>
    </>
  );
}

// کامپوننت AppContent
function AppContent({ Component, pageProps }) { // دیگر نیازی به sessionData به عنوان prop نیست
  const [addToCard, setAddToCard] = useState(0);
  const [addProduct, setAddProduct] = useState([]);
  const [orders, setOrders] = useState([]);
  // const { status } = useSession(); // این خط را حذف کنید، زیرا در Layout از آن استفاده می شود

  return (
    <AppContext.Provider value={{
      addToCard, setAddToCard,
      addProduct, setAddProduct,
      orders, setOrders,
    }}>
      <Layout> {/* Layout دیگر نیازی به prop sessionData ندارد */}
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

// کامپوننت اصلی App
export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {/* در اینجا فقط session را به SessionProvider می دهیم. */}
      {/* AppContent دیگر نیازی به sessionData به عنوان prop ندارد. */}
      <AppContent Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}