// pages/reset-password.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './resetPassword.module.css';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-reset-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token }),
      });

      const data = await response.json();

      if (response.ok) {
        // ذخیره ایمیل و توکن برای صفحه بعد
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetToken', token);
        router.push(`${process.env.NEXT_PUBLIC_APP_URL}/set-new-password`);
      } else {
        setError(data.error || 'Invalid token');
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
          <h2 className={styles.title}>Enter Reset Code</h2>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.error}>{error}</p>}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Enter reset code"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className={styles.link}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}>
              <span>Back to login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}