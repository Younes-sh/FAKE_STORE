// components/HomePage/Collections.js
import { useRef, useEffect, useState } from 'react';
import styles from './Collections.module.css';
import Image from 'next/image';

const Collections = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section className={styles.collections} ref={sectionRef}>
      <div className={styles.container}>
        <h2>OUR NEW COLLECTIONS</h2>
        <div className={styles.collectionsGrid}>
          <div className={`Diamond ${styles.collectionItem} ${isVisible ? styles.fadeIn : ''}`}>
            <div className={styles.collectionImage}>
              <Image src="/asset/Collection/Diamond.jpeg" alt="Diamond Collection" layout="fill" objectFit="cover" />
            </div>
            <h3>Eternal Diamond</h3>
            <p>Exquisite diamond pieces that capture light and attention</p>
          </div>
          <div className={`Golden ${styles.collectionItem} ${isVisible ? styles.fadeIn : ''}`} style={{animationDelay: '0.2s'}}>
            <div className={styles.collectionImage}>
              <Image src="/asset/Collection/Golden.jpg" alt="Gold Collection" layout="fill" objectFit="cover" />
            </div>
            <h3>Golden Heritage</h3>
            <p>Timeless gold jewelry with modern elegance</p>
          </div>
          <div className={`Pearl ${styles.collectionItem} ${isVisible ? styles.fadeIn : ''}`} style={{animationDelay: '0.4s'}}>
            <div className={styles.collectionImage}>
              <Image src="/asset/Collection/Pearl.jpeg" alt="Pearl Collection" layout="fill" objectFit="cover" />
            </div>
            <h3>Pearl Essence</h3>
            <p>Lustrous pearls in contemporary designs</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;