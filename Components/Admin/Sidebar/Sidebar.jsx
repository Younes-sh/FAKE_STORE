'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Style from './Sidebar.module.css';

export default function AdminSidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  user,
  navItems 
}) {
  const pathname = usePathname();

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };
    
    handleRouteChange();
  }, [pathname, setSidebarOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(`.${Style.adminSidebar}`);
      const mobileMenuBtn = document.querySelector(`.${Style.mobileMenuBtn}`);
      
      if (window.innerWidth <= 768 && 
          sidebarOpen && 
          !sidebar.contains(event.target) && 
          !mobileMenuBtn.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className={Style.mobileMenuBtn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className={Style.mobileOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={Style.sidebarContainer}>
        <aside className={`${Style.adminSidebar} ${sidebarOpen ? Style.open : Style.closed}`}>
          <div className={Style.sidebarHeader}>
            <h2 className={sidebarOpen ? '' : Style.hiddenText}>Admin Panel</h2>
            <button 
              className={Style.toggleBtn}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? '◄' : '►'}
            </button>
          </div>
          
          <nav className={Style.sidebarNav}>
            <ul>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className={`${Style.navLink} ${pathname === item.href ? Style.active : ''} ${sidebarOpen ? '' : Style.hiddenText}`}
                  >
                    {sidebarOpen ? (
                      <>
                        {item.icon && <span className={Style.navIcon}>{item.icon}</span>}
                        {item.label}
                      </>
                    ) : (
                      <span className={Style.iconOnly}>
                        {item.icon || item.label.charAt(0)}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className={Style.sidebarFooter}>
            <div className={`${Style.userInfo} ${sidebarOpen ? '' : Style.hiddenText}`}>
              <span className={Style.username}>{user?.username}</span>
              <span className={Style.role}>{user?.role}</span>
            </div>
            <button 
              className={`${Style.logoutBtn} ${sidebarOpen ? '' : Style.hiddenText}`}
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}