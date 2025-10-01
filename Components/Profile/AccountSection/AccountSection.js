import { useState } from 'react';
import styles from './AccountSection.module.css';

export default function AccountSection() {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogoutAllDevices = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید از همه دستگاه‌ها خارج شوید؟')) {
      return;
    }
    
    try {
      const response = await fetch('/api/logoutAllDevices', {
        method: 'POST',
      });

      if (response.ok) {
        alert('از همه دستگاه‌ها با موفقیت خارج شدید. لطفاً دوباره وارد شوید.');
        // ریدایرکت به صفحه login
        window.location.href = '/login';
      } else {
        throw new Error('خطا در خروج از همه دستگاه‌ها');
      }
    } catch (error) {
      console.error('خطا در خروج از همه دستگاه‌ها:', error);
      alert('خطا در خروج از همه دستگاه‌ها. لطفاً دوباره تلاش کنید.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید حساب کاربری خود را حذف کنید؟ این عمل غیرقابل بازگشت است.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const response = await fetch('/api/deleteAccount', {
        method: 'POST',
      });

      if (response.ok) {
        alert('حساب کاربری شما با موفقیت حذف شد.');
        // ریدایرکت به صفحه اصلی
        window.location.href = '/';
      } else {
        const data = await response.json();
        throw new Error(data.message || 'خطا در حذف حساب کاربری');
      }
    } catch (error) {
      console.error('خطا در حذف حساب کاربری:', error);
      alert(error.message || 'خطا در حذف حساب کاربری. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Log out from all devices</h3>
          </div>
          <p>Log out of all the devices you have logged in to.</p>
          <button 
            type="button" 
            className={styles.btnSecondary}
            onClick={handleLogoutAllDevices}
          >
            Log out from all devices
          </button>
        </div>
        
        <div className={`${styles.card} ${styles.dangerZone}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Delete account</h3>
          </div>
          <p>After deleting your account, all your information will be permanently deleted. This action is irreversible.</p>
          <button 
            type="button" 
            className={styles.dangerBtn}
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete account'}
          </button>
        </div>
      </div>
    </div>
  );
}