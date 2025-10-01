import { useState } from 'react';
import Navbar from '../Navbar/NavbarAfterLogin';
import Style from './Layout.module.css';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={Style.layout}>
      <Navbar />
      <main className={Style.main}>
        {children}
      </main>
    </div>
  );
}