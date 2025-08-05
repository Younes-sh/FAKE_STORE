import Head from "next/head";
import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiArrowLeft } from "react-icons/fi";
import { FaTelegram, FaWhatsapp, FaLinkedin } from "react-icons/fa";
import styles from './ContactPage.module.css';
import Footer from "@/Components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.container}>
      <Head>
        <title>Contact Us | Our Website</title>
        <meta name="description" content="Contact page with contact form and information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.wrapper}>
        <div className={styles.header}>
          <a href="/" className={styles.backLink}>
            <FiArrowLeft className={styles.backIcon} />
            Back to Home
          </a>
          <h1 className={styles.title}>Get In Touch</h1>
          <p className={styles.subtitle}>
            Have questions, suggestions, or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className={styles.contentGrid}>
          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Send Us a Message</h2>
            
            {submitStatus === "success" && (
              <div className={styles.successMessage}>
                Your message has been sent successfully. We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === "error" && (
              <div className={styles.errorMessage}>
                An error occurred while sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.formLabel}>
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  placeholder="Full name"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.formInput}
                  placeholder="your@email.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.formLabel}>
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={styles.formTextarea}
                  placeholder="Type your message here..."
                />
              </div>

              <div className={styles.formGroup}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`${styles.submitButton} ${isSubmitting ? styles.submitButtonDisabled : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h2 className={styles.sectionTitle}>Contact Information</h2>
              
              <div className={styles.infoItems}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <FiMail className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Email</h3>
                    <p className={styles.infoText}>info@example.com</p>
                    <p className={styles.infoText}>support@example.com</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <FiPhone className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Phone</h3>
                    <p className={styles.infoText}>+1 (123) 456-7890</p>
                    <p className={styles.infoText}>+1 (987) 654-3210</p>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIconWrapper}>
                    <FiMapPin className={styles.infoIcon} />
                  </div>
                  <div className={styles.infoContent}>
                    <h3 className={styles.infoTitle}>Address</h3>
                    <p className={styles.infoText}>123 Main Street, Suite 100</p>
                    <p className={styles.infoText}>New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.socialCard}>
              <h2 className={styles.sectionTitle}>Connect With Us</h2>
              
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLinkTelegram}>
                  <FaTelegram className={styles.socialIcon} />
                </a>
                <a href="#" className={styles.socialLinkWhatsapp}>
                  <FaWhatsapp className={styles.socialIcon} />
                </a>
                <a href="#" className={styles.socialLinkLinkedin}>
                  <FaLinkedin className={styles.socialIcon} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>

      <Footer />
    </>
  );
}