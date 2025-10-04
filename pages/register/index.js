// pages/register/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './register.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseUrl = getBaseUrl();
      const apiUrl = `${baseUrl}/api/auth/register`;
      
      console.log("🌐 API URL:", apiUrl);
      console.log("📝 Form Data:", formData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log("📨 Response Status:", response.status);
      
      const data = await response.json();
      console.log("📨 Response Data:", data);

      if (!response.ok) {
        throw new Error(data.message || `Registration failed with status ${response.status}`);
      }

      console.log("✅ Registration successful");
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      
    } catch (err) {
      console.error("❌ Registration error:", err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Cannot connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'Something went wrong during registration');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Create an Account</h2>
        
        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className={styles.input}
            disabled={isLoading}
            placeholder="Enter your username"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
            disabled={isLoading}
            placeholder="Enter your email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className={styles.input}
            disabled={isLoading}
            placeholder="Enter your password (min. 8 characters)"
          />
        </div>

        <button 
          type="submit" 
          className={styles.button}
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        <p className={styles.loginLink}>
          Already have an account?{' '}
          <Link href={'/login'} className={styles.link}>Login</Link>
        </p>
      </form>
    </div>
  );
}