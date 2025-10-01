import Link from 'next/link';
import Image from 'next/image';
import Styles from '../styles/404.module.css';
import ImageNotfound from '@/public/asset/404/404.png'
export default function Custom404() {
  return (
    <div className={Styles.container}>
      <Image
        src={ImageNotfound} // مسیر عکس داخل public
        alt="Page not found"
        width={400}
        height={300}
        className={Styles.image}
      />
      <h1 className={Styles.title}>404 - Page Not Found</h1>
      <p className={Styles.text}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/" className={Styles.link}>
        Go back to homepage
      </Link>
    </div>
  );
}
