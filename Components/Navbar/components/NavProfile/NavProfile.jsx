import Link from "next/link";
import { useState } from "react";
import Style from './navProfile.module.css';
import { signOut, useSession } from 'next-auth/react';

export default function NavProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();

    const OpenMenuProfile = () => setIsOpen(!isOpen);
    const CloseMenuProfile = () => setIsOpen(false);

    const handleSignOut = async () => {
    await signOut();
    // بعد از signOut، دستی redirect کنید
    window.location.href = '/login';
};

    if (status === "loading") return null;

    // نقش کاربر را به حروف کوچک تبدیل کنید
    const userRole = session?.user?.role?.toLowerCase();

    return (
        <div>
            <div className={Style.OpenMenuProfile} onClick={OpenMenuProfile}>
                <i className="fa-solid fa-user"></i>
            </div>

            {isOpen && (
                <div className={Style.menuProfile} onClick={CloseMenuProfile}>
                    <p><Link href="/profile">Profile</Link></p>
                    <p><Link href="/setting">Setting</Link></p>
                    <p><Link href="/notifications">Notifications</Link></p>

                    {/* از متغیر جدید برای بررسی نقش استفاده کنید */}
                    {userRole === "admin" && (
                        <p><Link href="/aXdmiNPage">Admin</Link></p>
                    )}
                    {userRole === "editor" && (
                        <p><Link href="/aXdmiNPage">Editor</Link></p>
                    )}

                    <br /><br /><br />

                    <button onClick={handleSignOut}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}