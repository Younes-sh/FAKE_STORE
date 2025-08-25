import Link from "next/link";
import { useState } from "react";
import Style from './navProfile.module.css';
import { signOut, useSession } from 'next-auth/react';

export default function NavProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const OpenMenuProfile = () => setIsOpen(!isOpen);
  const CloseMenuProfile = () => setIsOpen(false);

  if (status === "loading") return null; // تا زمانی که session لود بشه چیزی نشون نده

  return (
    <div>
      <div className={Style.OpenMenuProfile} onClick={OpenMenuProfile}>
        <i className="fa-solid fa-user"></i>
      </div>

      {isOpen && (
        <div className={Style.menuProfile} onClick={CloseMenuProfile}>
          <p><Link href="/profile">Profile</Link></p>
          <p><Link href="/settings">Settings</Link></p>
          <p><Link href="/notification">Notification</Link></p>

          {session?.user?.role === "admin" && (
            <p><Link href="/aXdmiNPage">Admin</Link></p>
          )}
          {session?.user?.role === "editor" && (
            <p><Link href="/aXdmiNPage">Editor</Link></p>
          )}

          <br /><br /><br />

          <button onClick={() => signOut({ callbackUrl: '/login' })}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
