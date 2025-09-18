import { useState } from 'react';
import styles from './Setting.module.css';
import ProfileSection from '@/Components/Profile/ProfileSection/ProfileSection';
import SecuritySection from '../../Components/Profile/SecuritySection/SecuritySection';
import PrivacySection from '../../Components/Profile/PrivacySection/PrivacySection';
import NotificationsSection from '../../Components/Profile/NotificationsSection/NotificationsSection';
import AccountSection from '../../Components/Profile/AccountSection/AccountSection';

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'User Profile', icon: 'fas fa-user', component: <ProfileSection /> },
    { id: 'security', label: 'Security', icon: 'fas fa-shield-alt', component: <SecuritySection /> },
    { id: 'privacy', label: 'Privacy', icon: 'fas fa-lock', component: <PrivacySection /> },
    { id: 'notifications', label: 'Announcements', icon: 'fas fa-bell', component: <NotificationsSection /> },
    { id: 'account', label: 'Account', icon: 'fas fa-user-cog', component: <AccountSection /> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1><i className="fas fa-cog"></i> User settings</h1>
        <p>Profile management and account settings</p>
      </div>
      
      <div className={styles.contentLayout}>
        <div className={styles.sidebar}>
          {sections.map(section => (
            <button
              key={section.id}
              className={`${styles.sidebarItem} ${activeSection === section.id ? styles.activeSidebarItem : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <i className={section.icon}></i>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.mainContent}>
          {sections.find(section => section.id === activeSection)?.component}
        </div>
      </div>
    </div>
  );
}