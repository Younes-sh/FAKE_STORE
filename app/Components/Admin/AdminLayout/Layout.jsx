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

  // Logic for auto-setting sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if not authenticated or not authorized
  useEffect(() => {
    if (status === 'loading') return;
    
    const allowedRoles = ['admin', 'editor'];
    const userRole = session?.user?.role;

    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (!allowedRoles.includes(userRole)) {
      router.push('/');
    }
  }, [session, status, router, pathname]);

  // Navigation items
  const navItems = [
    { href: "/aXdmiNPage", label: "Dashboard", icon: "📊" },
    { href: "/aXdmiNPage/postProduct", label: "New Products", icon: "🆕" },
    { href: "/aXdmiNPage/products", label: "Manage Products", icon: "📦" },
    { href: "/aXdmiNPage/users", label: "Users", icon: "👥" },
    { href: "/aXdmiNPage/message", label: "Messages", icon: "✉️" },
    { href: "/aXdmiNPage/notifications", label: "Create Notifications", icon: "🔔" },
    { href: "/aXdmiNPage/setting", label: "Settings", icon: "⚙️" },

  ];

  if (status === 'loading') {
    return (
      <div className={Style.loadingContainer}>
        <div className={Style.loadingSpinner}></div>
      </div>
    );
  }
  
  const allowedRoles = ['admin', 'editor'];
  if (!session || !allowedRoles.includes(session.user.role)) {
    return null;
  }

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
          <h1>{navItems.find(item => item.href === pathname)?.label || 'Dashboard'}</h1>
        </header>
        
        <div className={Style.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
}