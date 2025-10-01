import Style from './footer.module.css';

export default function Footer() {
  return (
    <footer className={Style.footer}>
      <div className={Style.footerContainer}>
        <div className={Style.footerColumns}>
          <div className={Style.footerColumn}>
            <h3 className={Style.footerHeading}>Luxury Jewelry</h3>
            <p className={Style.footerText}>Crafting timeless elegance since 2010. Our pieces are designed to last generations.</p>
          </div>
          
          <div className={Style.footerColumn}>
            <h3 className={Style.footerHeading}>Quick Links</h3>
            <ul className={Style.footerLinks}>
              <li><a href="#">Home</a></li>
              <li><a href="#">Collections</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          
          <div className={Style.footerColumn}>
            <h3 className={Style.footerHeading}>Contact Us</h3>
            <address className={Style.footerText}>
              123 Diamond Street<br/>
              Jewel City, JC 10001<br/>
              Phone: (123) 456-7890<br/>
              Email: info@luxuryjewelry.com
            </address>
          </div>
          
          <div className={Style.footerColumn}>
            <h3 className={Style.footerHeading}>Newsletter</h3>
            <p className={Style.footerText}>Subscribe for exclusive offers and updates</p>
            <form className={Style.newsletterForm}>
              <input type="email" placeholder="Your email" className={Style.newsletterInput}/>
              <button type="submit" className={Style.newsletterButton}>Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className={Style.footerBottom}>
          <p className={Style.copyright}>&copy; {new Date().getFullYear()} Luxury Jewelry. All rights reserved.</p>
          <div className={Style.socialIcons}>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-pinterest"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}