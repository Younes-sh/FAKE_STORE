import Style from './AdminNavbar.module.css';


export default function AdminNavbar() {
  return (
    <header className={Style.navbar}>
      <div className={Style.container}>
        <div className={Style.leftSection}>
          <button className={Style.menuButton}>
            <svg className={Style.menuIcon} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className={Style.title}>Admin Panel</h2>
        </div>
        <div className={Style.rightSection}>
          <button className={Style.notificationButton}>
            <svg className={Style.notificationIcon} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className={Style.badge}>3</span>
          </button>
          <div className={Style.avatar}>
            <img 
              className={Style.avatarImage}
              src="https://via.placeholder.com/150" 
              alt="User Profile" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}