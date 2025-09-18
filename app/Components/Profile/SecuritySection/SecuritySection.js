import { useState } from 'react';
import styles from './SecuritySection.module.css';

export default function SecuritySection() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('رمزهای عبور جدید مطابقت ندارند!');
      return;
    }
    
    try {
      const response = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwords),
      });

      if (response.ok) {
        alert('رمز عبور با موفقیت تغییر یافت!');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || 'خطا در تغییر رمز عبور');
      }
    } catch (error) {
      console.error('خطا در تغییر رمز عبور:', error);
      alert(error.message || 'خطا در تغییر رمز عبور. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      const response = await fetch('/api/toggleTwoFactor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !twoFactorEnabled }),
      });

      if (response.ok) {
        setTwoFactorEnabled(!twoFactorEnabled);
        alert(`احراز هویت دو مرحله‌ای ${!twoFactorEnabled ? 'فعال' : 'غیرفعال'} شد!`);
      } else {
        throw new Error('خطا در تغییر وضعیت احراز هویت دو مرحله‌ای');
      }
    } catch (error) {
      console.error('خطا در تغییر وضعیت احراز هویت:', error);
      alert('خطا در تغییر وضعیت احراز هویت. لطفاً دوباره تلاش کنید.');
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Security</h2>
      
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Change password</h3>
        </div>
        
        <form onSubmit={handlePasswordSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              className={styles.formControl}
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              className={styles.formControl}
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Repeat the new password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.formControl}
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          
          <button type="submit" className={styles.btnPrimary}>Update password</button>
        </form>
      </div>
      
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>Two-step verification</h3>
        </div>
        
        <div className={styles.toggleLabel}>
          <div className={styles.toggleText}>
            <h4>Enabling two-step verification</h4>
            <p>For greater security, enable two-step verification.</p>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
            />
            <span className={styles.slider}></span>
          </label>
        </div>
        
        <button type="button" className={styles.btnSecondary}>Configuration</button>
      </div>
    </div>
  );
}