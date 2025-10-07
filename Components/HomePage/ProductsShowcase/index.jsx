import { useRef, useEffect, useState } from 'react';
import styles from './ProductsShowcase.module.css';
import Image from 'next/image';

const ProductsShowcase = () => {
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
        rootMargin: '50px' // لود زودتر انیمیشن
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

  const categories = [
    { 
      name: "RING", 
      image: "/asset/Ring/Ring.jpg",
      sizes: "(max-width: 375px) 280px, (max-width: 576px) 160px, (max-width: 768px) 320px, (max-width: 992px) 240px, (max-width: 1200px) 200px, 180px"
    }, 
    { 
      name: "EARRING", 
      image: "/asset/Earring/Earring.jpg",
      sizes: "(max-width: 375px) 280px, (max-width: 576px) 160px, (max-width: 768px) 320px, (max-width: 992px) 240px, (max-width: 1200px) 200px, 180px"
    },
    { 
      name: "BRACELET", 
      image: "/asset/BRACELET/BRACELET.avif",
      sizes: "(max-width: 375px) 280px, (max-width: 576px) 160px, (max-width: 768px) 320px, (max-width: 992px) 240px, (max-width: 1200px) 200px, 180px"
    },
    { 
      name: "NECKLACE", 
      image: "/asset/Necklace/Necklace.jpg",
      sizes: "(max-width: 375px) 280px, (max-width: 576px) 160px, (max-width: 768px) 320px, (max-width: 992px) 240px, (max-width: 1200px) 200px, 180px"
    },
    { 
      name: "WATCH", 
      image: "/asset/watch.jpg",
      sizes: "(max-width: 375px) 280px, (max-width: 576px) 160px, (max-width: 768px) 320px, (max-width: 992px) 240px, (max-width: 1200px) 200px, 180px"
    }
  ];

  return (
    <section className={styles.productsShowcase} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <div 
              key={index} 
              className={`${styles.categoryItem} ${isVisible ? styles.slideIn : ''}`} 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.categoryImage}>
                <Image 
                  src={category.image} 
                  alt={`${category.name} jewelry collection`}
                  fill={true}
                  style={{ objectFit: 'cover' }}
                  sizes={category.sizes}
                  priority={index < 2} // لود سریع دو تصویر اول
                />
              </div>
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsShowcase;