import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // استفاده از هوک useSession برای بررسی وضعیت لاگین کاربر
  const { data: session, status } = useSession();
  
  // اگر کاربر قبلا لاگین کرده باشد، به صفحه پروفایل هدایت می‌شود
  useEffect(() => {
  if (session) {
    router.push('/profile');
  }
}, [session]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/profile',
    });

    if (result?.error) {
      console.error("Login error:", result.error);
      setError('Email or password is incorrect');
    }

  };

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginImageSection}>
        <div className={styles.loginImagePlaceholder}>
          <p>تصویر یا محتوای گرافیکی اینجا قرار می‌گیرد</p>
        </div>
      </div>
      
      <div className={styles.loginFormSection}>
        <div className={styles.loginFormContainer}>
          <h2 className={styles.loginTitle}>Login</h2>
          {error && <p className={styles.loginError}>{error}</p>}
          <form className={styles.loginForm} onSubmit={handleSubmit}>
            <div className={styles.formInputs}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={styles.loginInput}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={styles.loginInput}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Processing...' : 'Login'}
              </button>
            </div>
          </form>
          <div className={styles.registerLink}>
            <Link href="/register">
              <span>{`Don't have an account? Register`}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}