import Link from "next/link";
import { useState } from "react";
import User from "@/public/user.png";
import Image from "next/image";
import Style from './navProfile.module.css';

export default function NavProfile() {
  const [isOpen , setIsOpen] = useState(false);

  const OpenMenuProfile = () => {
    setIsOpen(!isOpen);
  };
  const CloseMenuProfile = () => {
    setIsOpen(false);
  }

  const LogOut = () => {
    localStorage.removeItem('token');
  }
  return (
    <div>
      <div onClick={OpenMenuProfile}>
        {/* <Image src={User} alt="Image" width={30} height={30} /> */}
        <Link href={''}>
          <i className="fa-solid fa-user"></i>
        </Link>
      </div>


      {/* Menu Profile */}
      {isOpen && (
        <div className={Style.menuProfile} onClick={CloseMenuProfile}>
          <p>
            <Link href="/profile">Profile</Link>
          </p>

          <p>
            <Link href="/orders">Orders</Link>
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

          <p style={{color:'red'}}>
            <button type="button" onClick={LogOut}>Logout</button>
          </p>
      </div>
      )}
    </div>
  )
}
