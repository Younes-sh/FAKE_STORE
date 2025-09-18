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
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/notifications/settings');
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
    setSaveStatus('saving');
    
    try {
      const response = await fetch('/api/updateNotificationSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } else {
        setNotificationSettings(prev => ({ ...prev, [setting]: !newValue }));
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(''), 2000);
        throw new Error('Error updating settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const getStatusMessage = () => {
    switch(saveStatus) {
      case 'saving':
        return 'Saving changes...';
      case 'saved':
        return 'Changes saved successfully!';
      case 'error':
        return 'Error saving changes. Please try again.';
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.section} ${isLoading ? styles.loading : ''}`}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h2 className={styles.sectionTitle}>Notification Preferences</h2>
          {saveStatus && (
            <span style={{
              color: saveStatus === 'saved' ? '#38a169' : saveStatus === 'error' ? '#e53e3e' : '#3182ce',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {getStatusMessage()}
            </span>
          )}
        </div>
        
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Email Notifications</h3>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>News and updates</h4>
              <p>Receive emails about product updates, new features, and company news</p>
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
              <h4>Account activity</h4>
              <p>Receive emails for important account-related activities and security alerts</p>
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
          <h3 className={styles.cardTitle}>In-app Notifications</h3>
          
          <div className={styles.toggleLabel}>
            <div className={styles.toggleText}>
              <h4>New messages</h4>
              <p>Receive notifications when you get new messages from other users</p>
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
              <h4>Push notifications</h4>
              <p>Receive instant notifications even when the app is closed (requires browser permission)</p>
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

        <div className={styles.infoText}>
          <h4>About Notification Settings</h4>
          <p>
            You can control which types of notifications you receive from our platform. 
            When disabled, you won't receive any notifications of that type. 
            Note: Some critical security notifications may still be sent regardless of these settings.
          </p>
        </div>
      </div>
    </div>
  );
}