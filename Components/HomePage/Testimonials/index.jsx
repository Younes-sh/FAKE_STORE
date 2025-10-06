// components/HomePage/Testimonials
import { useRef, useEffect, useState } from 'react';
import styles from './Testimonials.module.css';

const Testimonials = () => {
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

  const testimonials = [
    {
      name: "Sarah Johnson",
      comment: "The craftsmanship of my engagement ring is exceptional. I receive compliments every time I wear it!",
      rating: 5
    },
    {
      name: "Michael Chen",
      comment: "Their custom design service helped me create the perfect anniversary gift for my wife. Highly recommended!",
      rating: 5
    },
    {
      name: "Emma Wilson",
      comment: "The quality and attention to detail in every piece is remarkable. I'm a customer for life.",
      rating: 5
    }
  ];

  return (
    <section className={styles.testimonials} ref={sectionRef}>
      <div className={styles.container}>
        <h2>HOW OUR CLIENTS FEEL</h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`${styles.testimonialItem} ${isVisible ? styles.fadeIn : ''}`} 
                 style={{animationDelay: `${index * 0.2}s`}}>
              <div className={styles.stars}>
                {'★'.repeat(testimonial.rating)}
              </div>
              <p>"{testimonial.comment}"</p>
              <h4>- {testimonial.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;