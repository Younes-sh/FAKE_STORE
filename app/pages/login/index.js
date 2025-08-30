import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LoginPage.module.css';
import Image from 'next/image';
// import loginImage from "../../../public/watch.jpg"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // استفاده از هوک useSession برای بررسی وضعیت لاگین کاربر
  const { data: session, status } = useSession();
  
  // اگر کاربر قبلا لاگین کرده باشد، به صفحه پروفایل هدایت می‌شود
  useEffect(() => {
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    if (session) {
      router.push(`${baseUrl}/profile`);
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
          {/* <Image src={loginImage} alt="Login Image" className={styles.loginImage} /> */}
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
            <Link href="/register" className={styles.registerLinkText}>
              <span>{`Don't have an account? Register`}</span>
            </Link>
            <br />
            <Link href="/forgetPassword" className={styles.forgetPasswordLinkText}>
              <span>Forgot your password?</span>
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
}