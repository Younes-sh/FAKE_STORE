// pages/set-new-password.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './setNewPassword.module.css';

export default function SetNewPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();

  useEffect(() => {
    // دریافت ایمیل و توکن از localStorage
    const savedEmail = localStorage.getItem('resetEmail');
    const savedToken = localStorage.getItem('resetToken');
    
    if (!savedEmail || !savedToken) {
      router.push('/forgot-password');
      return;
    }
    
    setEmail(savedEmail);
    setToken(savedToken);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully!');
        // پاک کردن localStorage
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetToken');
        
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Set New Password</h2>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className={styles.link}>
            <Link href={'/login'}>
              <span>Back to login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}