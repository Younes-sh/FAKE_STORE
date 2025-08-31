// pages/forgotPassword.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './forgetPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

// pages/forgotPassword.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setMessage('');

  try {
    console.log('Sending email:', email);

    const response = await fetch('/api/auth/forgotPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email: email.trim().toLowerCase() 
      }),
    });

    console.log('Response status:', response.status);

    // بررسی content-type قبل از parse کردن JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('Server returned non-JSON response: ' + text);
    }
    
    if (response.ok) {
      setMessage(data.message || "A password reset link has been sent to your email.");
    } else {
      setError(data.error || 'An error occurred');
    }
  } catch (error) {
    console.error('Error details:', error);
    setError(error.message || 'A network error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginFormSection}>
        <div className={styles.loginFormContainer}>
          <h2 className={styles.loginTitle}>Reset password</h2>
          {message && <p className={styles.successMessage}>{message}</p>}
          {error && <p className={styles.loginError}>{error}</p>}
          
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={styles.loginInput}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
              </button>
            </div>
          </form>

          <div className={styles.registerLink}>
            <Link href="/login">
              <span>Back to login page</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}