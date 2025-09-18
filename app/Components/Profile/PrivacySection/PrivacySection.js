import { useState } from 'react';
import styles from './PrivacySection.module.css';

export default function PrivacySection() {
  // استفاده از localStorage برای ذخیره تنظیمات در مرورگر کاربر
  const [privacySettings, setPrivacySettings] = useState(() => {
    // بارگذاری تنظیمات از localStorage یا استفاده از مقادیر پیش‌فرض
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('privacySettings');
      return saved ? JSON.parse(saved) : {
        isPrivate: true,
        allowComments: true,
        showOnlineStatus: false,
      };
    }
    return {
      isPrivate: true,
      allowComments: true,
      showOnlineStatus: false,
    };
  });

  const handleToggle = (setting) => {
    const newValue = !privacySettings[setting];
    const updatedSettings = { ...privacySettings, [setting]: newValue };
    
    // به‌روزرسانی state
    setPrivacySettings(updatedSettings);
    
    // ذخیره در localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('privacySettings', JSON.stringify(updatedSettings));
    }
    
    // نمایش پیام موفقیت
    alert(`Settings have been successfully updated!`);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Privacy settings</h2>
      
      <div className={styles.infoBox}>
        <i className="fas fa-info-circle"></i>
        <p>These settings are only saved in your current browser.</p>
      </div>
      
      <div className={styles.card}>
        <div className={styles.toggleLabel}>
          <div className={styles.toggleText}>
            <h4>Private account</h4>
            <p>Only verified users can see your posts.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={privacySettings.isPrivate}
              onChange={() => handleToggle('isPrivate')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.card}>
        <div className={styles.toggleLabel}>
          <div className={styles.toggleText}>
            <h4>Enable comments</h4>
            <p>Let others comment on your posts.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={privacySettings.allowComments}
              onChange={() => handleToggle('allowComments')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.card}>
        <div className={styles.toggleLabel}>
          <div className={styles.toggleText}>
            <h4>Show online status</h4>
            <p>Show others that you are online</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={privacySettings.showOnlineStatus}
              onChange={() => handleToggle('showOnlineStatus')}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
      </div>
      
      <div className={styles.note}>
        <h4>Attention:</h4>
        <p>For e-commerce sites, these settings are usually managed at the server level. This page is just a preview of possible features.</p>
      </div>
    </div>
  );
}