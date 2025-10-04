import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Styles from "./profile.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileModal from "@/Components/Profile/EditProfile/EditProfileModal";
import UserImage from "@/public/user.png";
import Tabs from "@/Components/Profile/TabProfile/TabProfile";
import { useRouter } from "next/router";
import Footer from "@/Components/Footer";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const [isDeleted, setIsDeleted] = useState(false); // حالت جدید برای ردیابی حذف کاربر

  /* -------------------------
     اتصال به Socket.IO
  -------------------------- */
  useEffect(() => {
    
  }, [session]);

  /* -------------------------
     گوش دادن به ایونت‌ها
  -------------------------- */
  useEffect(() => {
    
  }, [ session, update, router]);

  // Logout function

  const handleSignOut = () => {
    const baseUrl = window.location.origin; // گرفتن آدرس اصلی سایت
    signOut({ callbackUrl: `${baseUrl}/login` });
  };

  /* -------------------------
     حذف اکانت (کاربر خودش)
  -------------------------- */
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/${session.user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleted(true); // علامتگذاری که کاربر حذف شده
        await signOut({ redirect: false }); // خروج بدون ریدایرکت خودکار
        router.push(`${process.env.NEXT_PUBLIC_APP_URL}/login?message=account_deleted`); // ریدایرکت به صفحه login با پیام
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  /* -------------------------
     اگر کاربر حذف شده باشد به صفحه login ریدایرکت شود
  -------------------------- */
  useEffect(() => {
    if (isDeleted) {
      router.push(`${process.env.NEXT_PUBLIC_APP_URL}/login?message=account_deleted`);
    }
  }, [isDeleted, router]);

  /* -------------------------
     اگر کاربر لاگین نباشد
  -------------------------- */
  if (!session) {
    return (
      <div className={Styles.profileContainer}>
        <div className={Styles.profileCard} style={{ gridTemplateColumns: "1fr" }}>
          <div className={Styles.profileContent}>
            <h2 className={Styles.sectionTitle}>Access Denied</h2>
            <p>You need to be logged in to view this page.</p>
            <div className={Styles.actions}>
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/login`} className={`${Styles.btn} ${Styles.primaryBtn}`}>
                Login
              </Link>
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/register`} className={`${Styles.btn} ${Styles.secondaryBtn}`}>
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------
     صفحه پروفایل
  -------------------------- */
  return (
    <>
      <div className={Styles.profileContainer}>
        <div className={Styles.profileCard}>
          {/* Profile Header */}
          <div className={Styles.profileHeader}>
            {/* <Image
              src={UserImage}
              alt="User Avatar"
              className={Styles.avatar}
              width={100}
              height={100}
              priority
            />  */}
            <div className={Styles.avatarWrapper}>
              <Image.default 
              src={UserImage} 
              alt="User Avatar" 
              className={Styles.avatar}
              priority={true}
              fill={true}
              // sizes="(max-width: 100px) 100vw, (max-width: 100px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}  
            />
            </div>
            

            <div className={Styles.userInfo}>
              <h1 className={Styles.userName}>{session.user.username}</h1>
              <p className={Styles.userEmail}>{session.user.email}</p>
              <span className={Styles.userRole}>Role: {session.user.role}</span>
            </div>

            {/* Account Settings */}
            <h2 className={Styles.sectionTitle}>Account Settings</h2>
            <ul className={Styles.settingsList}>
              <li className={Styles.settingItem}>
                <span className={Styles.settingLabel}>Email Notifications</span>
                <label className={Styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <span className={Styles.slider}></span>
                </label>
              </li>
            </ul>

            {/* Action Buttons */}
            <div className={Styles.actions}>
              <button
                onClick={() => setShowEditModal(true)}
                className={`${Styles.btn} ${Styles.secondaryBtn}`}
              >
                Edit Profile
              </button>
              <button
                onClick={handleSignOut}
                className={`${Styles.btn} ${Styles.dangerBtn}`}
              >
                Logout
              </button>
              <button
                onClick={handleDeleteAccount}
                className={`${Styles.btn} ${Styles.dangerBtn}`}
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className={Styles.profileContent}>
            <Tabs />
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            user={session.user}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </div>

      <Footer />
    </>
  );
}