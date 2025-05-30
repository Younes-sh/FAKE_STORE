import Link from "next/link";
import { useState } from "react";
import User from "@/public/user.png";
import Image from "next/image";
import Style from './navProfile.module.css';
import { signOut } from 'next-auth/react';

export default function NavProfile() {
  const [isOpen , setIsOpen] = useState(false);

  const OpenMenuProfile = () => {
    setIsOpen(!isOpen);
  };
  const CloseMenuProfile = () => {
    setIsOpen(false);
  }

  
  return (
    <div>
      <div className={Style.OpenMenuProfile} onClick={OpenMenuProfile}>
        {/* <Image src={User} alt="Image" width={30} height={30} /> */}
          <i className="fa-solid fa-user"></i>
      </div>


      {/* Menu Profile */}
      {isOpen && (
        <div className={Style.menuProfile} onClick={CloseMenuProfile}>
          <p>
            <Link href="/profile">Profile</Link>
          </p>

          <p>
            <Link href="/profile">Orders</Link>
          </p>

          <p>
            <Link href="/settings">Settings</Link>
          </p>

          <p>
            <Link href="/notification">Notification</Link>
          </p>

          <br />
          <br />
          <br />

            <button type="button" onClick={() => signOut()}>Logout</button>
      </div>
      )}
    </div>
  )
}
