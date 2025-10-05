import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './LoginPage.module.css';
import Image from 'next/image';
import loginImage from '../../public/asset/watch.jpg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // حالت جدید برای نمایش پسورد
  const router = useRouter();
  
  const { data: session, status } = useSession();
  
  useEffect(() => {
    if (session) {
      router.push(`/profile`);
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('verify your email')) {
          throw new Error('Please verify your email before logging in. Check your inbox.');
        }
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginImageSection}>
        <div className={styles.loginImagePlaceholder}>
         <Image.default 
          src={loginImage} 
          alt="Login Image" 
          className={styles.loginImage}
          priority={true}
          fill={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}  
        />
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
                  disabled={isLoading}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className={styles.passwordInputContainer}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className={styles.loginInput}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading || status === 'loading'}
              >
                {isLoading ? 'Processing...' : 'Login'}
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