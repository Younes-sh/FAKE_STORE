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

  // Auto-set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router, pathname]);

  // Navigation items with optional icons
  const navItems = [
    { href: "/aXdmiNPage", label: "Dashboard", icon: "📊" },
    { href: "/aXdmiNPage/postProduct", label: "New Products", icon: "🆕" },
    { href: "/aXdmiNPage/products", label: "Manage Products", icon: "📦" },
    { href: "/aXdmiNPage/users", label: "Users", icon: "👥" },
    { href: "/aXdmiNPage/message", label: "Messages", icon: "✉️" },
    { href: "/aXdmiNPage/setting", label: "Settings", icon: "⚙️" },
  ];

  if (status === 'loading') {
    return (
      <div className={Style.loadingContainer}>
        <div className={Style.loadingSpinner}></div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
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