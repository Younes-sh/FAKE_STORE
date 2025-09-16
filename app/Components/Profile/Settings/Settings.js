import { useState } from 'react';
import styles from './Settings.module.css';
import ProfileSection from './ProfileSection';
import SecuritySection from './SecuritySection';
import PrivacySection from './PrivacySection';
import NotificationsSection from './NotificationsSection';
import AccountSection from './AccountSection';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  const handleUpdateUser = (updatedData) => {
    // به روزرسانی داده‌های کاربر در state اصلی اگر لازم باشد
    console.log('User data updated:', updatedData);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection onUpdateUser={handleUpdateUser} />;
      case 'security':
        return <SecuritySection />;
      case 'privacy':
        return <PrivacySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'account':
        return <AccountSection />;
      default:
        return <ProfileSection onUpdateUser={handleUpdateUser} />;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><i className="fas fa-cog"></i> User settings</h1>
        <p>Profile management and account settings</p>
      </div>
      
      <div className={styles.content}>
        <div className={styles.sidebar}>
          <ul className={styles.menu}>
            <li 
              className={activeSection === 'profile' ? styles.active : ''}
              onClick={() => setActiveSection('profile')}
            >
              <i className="fas fa-user"></i> User Profile
            </li>
            <li 
              className={activeSection === 'security' ? styles.active : ''}
              onClick={() => setActiveSection('security')}
            >
              <i className="fas fa-shield-alt"></i> Security
            </li>
            <li 
              className={activeSection === 'privacy' ? styles.active : ''}
              onClick={() => setActiveSection('privacy')}
            >
              <i className="fas fa-lock"></i> Privacy
            </li>
            <li 
              className={activeSection === 'notifications' ? styles.active : ''}
              onClick={() => setActiveSection('notifications')}
            >
              <i className="fas fa-bell"></i> Announcements
            </li>
            <li 
              className={activeSection === 'account' ? styles.active : ''}
              onClick={() => setActiveSection('account')}
            >
              <i className="fas fa-user-cog"></i> Account
            </li>
          </ul>
        </div>
        
        <div className={styles.main}>
          {renderSection()}
        </div>
      </div>
    </div>
  );
}