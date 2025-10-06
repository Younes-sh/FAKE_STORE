// Components/HomePage/WhyChooseUs.js
import { useRef, useEffect, useState } from 'react';
import styles from './WhyChooseUs.module.css';

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        sectionRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          window.addEventListener('scroll', handleScroll);
        } else {
          window.removeEventListener('scroll', handleScroll);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const features = [
    {
      title: "Expert Craftsmanship",
      description: "Each piece is meticulously crafted by our master jewelers with decades of experience."
    },
    {
      title: "Ethically Sourced",
      description: "We are committed to responsible sourcing of all our materials."
    },
    {
      title: "Lifetime Warranty",
      description: "All our jewelry comes with a comprehensive lifetime warranty."
    },
    {
      title: "Custom Designs",
      description: "Work with our designers to create a unique piece that tells your story."
    }
  ];

  return (
    <section className={styles.whyChooseUs}>
      <div className={styles.parallaxBg} ref={sectionRef}></div>
      <div className={styles.container}>
        <h2>WHY CHOOSE OUR BRAND</h2>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={`${styles.featureItem} ${isVisible ? styles.fadeIn : ''}`} 
                 style={{animationDelay: `${index * 0.1}s`}}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;