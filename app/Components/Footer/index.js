import Style from './footer.module.css';
import { FaInstagram, FaTwitter, FaPinterest, FaFacebookF } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={Style.footer}>
      <div className={Style.container}>
        {/* بخش لوگو و توضیحات */}
        <div className={Style.logoSection}>
          <Link href="/" className={Style.logo}>GEMSTONE</Link>
          <p className={Style.tagline}>
Supplier of handmade ornaments and jewelry with best quality and unique designs
          </p>
          <div className={Style.socialIcons}>
            <Link href="#" className={Style.socialIcon}><FaInstagram /></Link>
            <Link href="#" className={Style.socialIcon}><FaFacebookF /></Link>
            <Link href="#" className={Style.socialIcon}><FaTwitter /></Link>
            <Link href="#" className={Style.socialIcon}><FaPinterest /></Link>
          </div>
        </div>

        {/* لینک‌های سریع */}
        <div className={Style.section}>
          <h3 className={Style.sectionTitle}>Quick links</h3>
          <ul className={Style.linksList}>
            <li className={Style.linkItem}><Link href="/products" className={Style.link}>Products</Link></li>
            <li className={Style.linkItem}><Link href="/new-arrivals" className={Style.link}>New Arrivals</Link></li>
            <li className={Style.linkItem}><Link href="/best-sellers" className={Style.link}>Best Sellers</Link></li>
            <li className={Style.linkItem}><Link href="/sale" className={Style.link}>Sale</Link></li>
            <li className={Style.linkItem}><Link href="/gifts" className={Style.link}>Gifts</Link></li>
          </ul>
        </div>

        {/* اطلاعات تماس */}
        <div className={Style.section}>
          <h3 className={Style.sectionTitle}>Contact us</h3>
          <div className={Style.contactInfo}>
            <p>Tehran, Vali Asr Street, No. 1234</p>
            <p>Phone: 021-12345678</p>
            <p>Email: info@gemstone.com</p>
            <p>Working hours: 9 AM to 8 PM</p>
          </div>
        </div>

        {/* خبرنامه */}
        <div className={Style.section}>
          <h3 className={Style.sectionTitle}>Newsletter</h3>
          <p>To receive the latest discounts and products, please enter your email</p>
          <form className={Style.newsletterForm}>
            <input
              type="email"
              placeholder="Your email address"
              className={Style.newsletterInput}
              required 
            />
            <button type="submit" className={Style.newsletterButton}>Register</button>
          </form>
        </div>
      </div>

      {/* کپی رایت */}
      <div className={Style.copyright}>
        <p>&copy; {new Date().getFullYear()} GEMSTONE. All rights reserved.</p>
      </div>
    </footer>
  )
}