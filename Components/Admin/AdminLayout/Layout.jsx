'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '../Sidebar/Sidebar';
import Style from './AdminLayout.module.css';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const allowedRoles = ['admin', 'editor'];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect logic
  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (!allowedRoles.includes(session.user.role)) {
      router.push('/');
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return (
      <div className={Style.loadingContainer}>
        <div className={Style.loadingSpinner}></div>
      </div>
    );
  }

  if (!session || !allowedRoles.includes(session.user.role)) {
    return null;
  }

  const navItems = [
    { href: "/aXdmiNPage", label: "Dashboard", icon: "📊" },
    { href: "/aXdmiNPage/postProduct", label: "New Products", icon: "🆕" },
    { href: "/aXdmiNPage/products", label: "Manage Products", icon: "📦" },
    { href: "/aXdmiNPage/users", label: "Users", icon: "👥" },
    { href: "/aXdmiNPage/message", label: "Messages", icon: "✉️" },
    { href: "/aXdmiNPage/notifications", label: "Create Notifications", icon: "🔔" },
    { href: "/aXdmiNPage/setting", label: "Settings", icon: "⚙️" },
  ];

  const currentNav = navItems.find(item => pathname.startsWith(item.href));

  return (
    <div className={Style.adminContainer}>
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={session.user}
        navItems={navItems}
      />

      <main className={`${Style.adminMain} ${sidebarOpen ? Style.mainOpen : Style.mainClosed}`}>
        <header className={Style.adminHeader}>
          <button
            className={Style.mobileMenuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <h1 className={Style.adminHeaderTitle}>{currentNav?.label}</h1>
        </header>

        <div className={Style.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}
