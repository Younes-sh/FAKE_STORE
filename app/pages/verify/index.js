// pages/verify/index.js

import { useState } from "react";
import { useRouter } from "next/router";
import styles from "./verify.module.css"; // import استایل

export default function VerifyPage() {
  const router = useRouter();
  const [email, setEmail] = useState(() => (typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('email') || '') : ''));
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setMsg("Email verified! You can now log in.");
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}/login`)
    } catch (err) {
      setMsg(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/resendCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setMsg("New code sent. Please check your email.");
    } catch (e) {
      setMsg(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Email Verification</h1>
        <p className={styles.subtitle}>Please enter the verification code sent to your email</p>
      </div>
      
      <form onSubmit={handleVerify} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>6-digit code</label>
          <input
            type="text"
            value={code}
            onChange={(e)=>setCode(e.target.value.trim())}
            required
            maxLength={6}
            inputMode="numeric"
            className={`${styles.input} ${styles.codeInput}`}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          className={`${styles.button} ${loading ? styles.loading : ''}`}
        >
          {loading ? "Checking..." : "Confirmation"}
        </button>
      </form>
      
      <button 
        onClick={handleResend} 
        disabled={loading} 
        className={styles.resendButton}
      >
        Resend Code
      </button>
      
      {msg && (
        <div className={`${styles.message} ${msg.includes("Error") ? styles.error : styles.success}`}>
          {msg}
        </div>
      )}
    </div>
  );
}