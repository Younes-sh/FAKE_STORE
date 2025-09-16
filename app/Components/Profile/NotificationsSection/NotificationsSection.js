import { useState, useEffect } from 'react';
import styles from './NotificationsSection.module.css';

export default function NotificationsSection() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newsUpdates: true,
    activityNotifications: true,
    messageNotifications: true,
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/getNotificationSettings');
        const data = await res.json();
        
        if (res.ok) {
          setNotificationSettings(data);
        }
      } catch (error) {
        console.error('Error retrieving notification settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotificationSettings();
  }, []);

  const handleToggle = async (setting) => {
    const newValue = !notificationSettings[setting];
    const updatedSettings = { ...notificationSettings, [setting]: newValue };
    
    setNotificationSettings(updatedSettings);
    
    try {
      const response = await fetch('/api/updateNotificationSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        setNotificationSettings(prev => ({ ...prev, [setting]: !newValue }));
        throw new Error('Error updating settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Error updating settings. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.section} ${isLoading ? styles.loading : ''}`}>
        <h2 className={styles.sectionTitle}>Announcements</h2>
        
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Email</h3>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>News and updates</h4>
              <p>Receiving news emails and new notifications</p>
            </div>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={notificationSettings.newsUpdates}
                onChange={() => handleToggle('newsUpdates')}
                disabled={isLoading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>Informing about activities</h4>
              <p>Receive emails for account-related activities</p>
            </div>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={notificationSettings.activityNotifications}
                onChange={() => handleToggle('activityNotifications')}
                disabled={isLoading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>In-app notifications</h3>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>New messages</h4>
              <p>Receive notifications for new messages</p>
            </div>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={notificationSettings.messageNotifications}
                onChange={() => handleToggle('messageNotifications')}
                disabled={isLoading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>Emergency announcements</h4>
              <p>Receive instant notifications even when the app is closed.</p>
            </div>
            <label className={styles.toggleSwitch}>
              <input 
                type="checkbox" 
                checked={notificationSettings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
                disabled={isLoading}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}