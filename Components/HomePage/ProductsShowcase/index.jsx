// Components/HomePage/ProductsShowcase.js
import { useRef, useEffect, useState } from 'react';
import styles from './ProductsShowcase.module.css';
import Image from 'next/image'; // import درست

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

  const categories = [
    { name: "RING", image: "/asset/Ring/Ring.jpg" }, 
    { name: "EARRING", image: "/asset/Earring/Earring.jpg" },
    { name: "BRACELET", image: "/asset/BRACELET/BRACELET.avif" },
    { name: "NECKLACE", image: "/asset/Necklace/Necklace.jpg" },
    { name: "WATCH", image: "/asset/watch.jpg" }
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
                  alt={`${category.name} jewelry collection`} // بهبود alt
                  fill={true} // جایگزین layout="fill"
                  style={{ objectFit: 'cover' }} // جایگزین objectFit
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // برای responsive
                  priority={false} // lazy loading پیش‌فرض
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