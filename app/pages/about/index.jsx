import Head from "next/head";
import styles from './About.module.css'; // Assuming you have a CSS module
import Footer from "@/Components/Footer"; // Importing Footer component

export default function About() {
  return (
    <div className={styles.container}>
      <Head>
        <title>About | Experimental Store</title>
        <meta name="description" content="About our experimental e-commerce platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Welcome to Our Experimental Platform</h1>
          <p className={styles.subtitle}>A playground for e-commerce concepts</p>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Important Notice</h2>
            <div className={styles.cardBody}>
              <p className={styles.highlight}>
                ⚠️ This is <strong>purely an experimental website</strong> for demonstration purposes only.
              </p>
              <p>
                No actual purchases can be made on this platform. All products, transactions, 
                and user data are simulated for testing and educational purposes.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>About This Project</h2>
            <div className={styles.cardBody}>
              <p>
                This fake store authentication system is built with Next.js and React to demonstrate 
                modern web development techniques in e-commerce applications.
              </p>
              <p>
                It showcases authentication flows, product listings, and other e-commerce features 
                without any real commercial functionality.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Developer Information</h2>
            <div className={styles.cardBody}>
              <p>Created as a personal project by:</p>
              
              <div className={styles.links}>
                <a 
                  href="https://github.com/Younes-sh" 
                  target='_blank' 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <img
                    src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
                    alt="GitHub Profile"
                  />
                </a>
                
                <a 
                  href="https://younessheikhlar.com/" 
                  target='_blank' 
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <img
                    src="https://img.shields.io/badge/Portfolio-%23000000.svg?style=for-the-badge&logo=firefox&logoColor=#FF7139"
                    alt="Personal Portfolio"
                  />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  )
}