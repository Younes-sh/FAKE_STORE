'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Style from './styleLayout.module.css';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false); // تغییر به false برای حالت بسته پیش‌فرض

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (session.user.role !== 'admin') {
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

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  const navItems = [
    { href: "/aXdmiNPage", label: "Dashboard" },
    { href: "/aXdmiNPage/postProduct", label: "New Products" },
    { href: "/aXdmiNPage/products", label: "Manage Products" },
    { href: "/aXdmiNPage/users", label: "Users" },
    { href: "/aXdmiNPage/message", label: "Messages" },
    { href: "/aXdmiNPage/setting", label: "Settings" },
  ];

  
  return (
    <div className={Style.adminContainer}>
      {/* Sidebar */}
      <aside className={`${Style.adminSidebar} ${sidebarOpen ? Style.open : Style.closed}`}>
        <div className={Style.sidebarHeader}>
          <h2 className={sidebarOpen ? '' : Style.hiddenText}>Admin Panel</h2>
          <button 
            className={Style.toggleBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <nav className={Style.sidebarNav}>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`${pathname === item.href ? Style.active : ''} ${sidebarOpen ? '' : Style.hiddenText}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={Style.sidebarFooter}>
          <div className={`${Style.userInfo} ${sidebarOpen ? '' : Style.hiddenText}`}>
            <span className={Style.username}>{session.user.username}</span>
            <span className={Style.role}>{session.user.role}</span>
          </div>
          <button 
            className={`${Style.logoutBtn} ${sidebarOpen ? '' : Style.hiddenText}`}
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${Style.adminMain} ${sidebarOpen ? Style.mainOpen : Style.mainClosed}`}>
        <header className={Style.adminHeader}>
          <h1>{navItems.find(item => item.href === pathname)?.label || 'Dashboard'}</h1>
        </header>
        
        <div className={`${Style.contentWrapper} ${Style.container}`}>
          {children}
        </div>
      </main>
    </div>
  );
}