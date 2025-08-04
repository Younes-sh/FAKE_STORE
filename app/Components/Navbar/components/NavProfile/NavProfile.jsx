import Link from "next/link";
import { useState, useEffect } from "react";
import User from "@/public/user.png";
import Image from "next/image";
import Style from './navProfile.module.css';
import { signOut, useSession } from 'next-auth/react';

export default function NavProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const OpenMenuProfile = () => {
    setIsOpen(!isOpen);
  };
  const CloseMenuProfile = () => {
    setIsOpen(false);
  }

  return (
    <div>
      <div className={Style.OpenMenuProfile} onClick={OpenMenuProfile}>
        <i className="fa-solid fa-user"></i>
      </div>

      {/* Menu Profile */}
      {isOpen && (
        <div className={Style.menuProfile} onClick={CloseMenuProfile}>
          <p>
            <Link href="/profile">Profile</Link>
          </p>

          <p>
            <Link href="/settings">Settings</Link>
          </p>

          <p>
            <Link href="/notification">Notification</Link>
          </p>

          {session?.user?.role === "admin" && (
            <p>
              <Link href="/younessheikhlar">Admin</Link>
            </p>
          )}

          <br />
          <br />
          <br />

          <button type="button" onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  )
}