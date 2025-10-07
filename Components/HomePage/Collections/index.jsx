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
      { 
        threshold: 0.2,
        rootMargin: '50px'
      }
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

  const collections = [
    {
      className: 'Diamond',
      src: '/asset/Collection/Diamond.jpeg',
      alt: 'Diamond Collection',
      title: 'Eternal Diamond',
      description: 'Exquisite diamond pieces that capture light and attention',
      delay: '0s'
    },
    {
      className: 'Golden',
      src: '/asset/Collection/Golden.jpg',
      alt: 'Gold Collection',
      title: 'Golden Heritage',
      description: 'Timeless gold jewelry with modern elegance',
      delay: '0.2s'
    },
    {
      className: 'Pearl',
      src: '/asset/Collection/Pearl.jpeg',
      alt: 'Pearl Collection',
      title: 'Pearl Essence',
      description: 'Lustrous pearls in contemporary designs',
      delay: '0.4s'
    }
  ];

  return (
    <section className={styles.collections} ref={sectionRef}>
      <div className={styles.container}>
        <h2>OUR NEW COLLECTIONS</h2>
        <div className={styles.collectionsGrid}>
          {collections.map((collection, index) => (
            <div 
              key={index}
              className={`${collection.className} ${styles.collectionItem} ${isVisible ? styles.fadeIn : ''}`}
              style={{ animationDelay: collection.delay }}
            >
              <div className={styles.collectionImage}>
                <Image 
                  src={collection.src} 
                  alt={collection.alt}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index === 0} // لود سریع اولین تصویر
                />
              </div>
              <h3>{collection.title}</h3>
              <p>{collection.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;