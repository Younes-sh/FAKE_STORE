import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import Link from 'next/link';

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current && window.innerWidth > 480) {
        // غیرفعال کردن پارالکس در موبایل برای عملکرد بهتر
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        heroRef.current.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground} ref={heroRef}></div>
      <div className={styles.heroContent}>
        <h1>Timeless Elegance</h1>
        <p>Discover our exclusive jewelry collections crafted with precision and elegance</p>
        <Link href="/products" legacyBehavior>
          <a>
            <button className={styles.ctaButton}>Explore Collections</button>
          </a>
        </Link>
      </div>
    </section>
  );
};

export default Hero;