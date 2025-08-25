import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Styles from "./profile.module.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import EditProfileModal from "@/Components/Profile/EditProfile/EditProfileModal";
import DefaultImage from "@/public/user.png";
import Tabs from "@/Components/Profile/TabProfile/TabProfile";
import { useRouter } from "next/router";
import Footer from "@/Components/Footer";
import { io } from "socket.io-client";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [isDeleted, setIsDeleted] = useState(false); // حالت جدید برای ردیابی حذف کاربر

  /* -------------------------
     اتصال به Socket.IO
  -------------------------- */
  useEffect(() => {
    if (session) {
      const newSocket = io({ path: "/api/socket" });
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [session]);

  /* -------------------------
     گوش دادن به ایونت‌ها
  -------------------------- */
  useEffect(() => {
    if (!socket || !session) return;

    // وقتی پروفایل کاربر آپدیت شد (مثلاً role تغییر کرد)
    socket.on("user-update", (data) => {
      if (data._id === session.user.id) {
        // به جای reload کل صفحه → آپدیت session
        update({
          ...session,
          user: { ...session.user, ...data },
        });
      }
    });

    // وقتی کاربر حذف شد → signOut و redirect به login
    socket.on("user-delete", async (data) => {
      if (data._id === session.user.id) {
        setIsDeleted(true); // علامتگذاری که کاربر حذف شده
        await signOut({ redirect: false }); // خروج بدون ریدایرکت خودکار
        router.push("/login?message=account_deleted"); // ریدایرکت به صفحه login با پیام
      }
    });

    return () => {
      socket.off("user-update");
      socket.off("user-delete");
    };
  }, [socket, session, update, router]);

  /* -------------------------
     حذف اکانت (کاربر خودش)
  -------------------------- */
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/user/${session.user.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setIsDeleted(true); // علامتگذاری که کاربر حذف شده
        await signOut({ redirect: false }); // خروج بدون ریدایرکت خودکار
        router.push("/login?message=account_deleted"); // ریدایرکت به صفحه login با پیام
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
      router.push("/login?message=account_deleted");
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
              <Link href="/login" className={`${Styles.btn} ${Styles.primaryBtn}`}>
                Login
              </Link>
              <Link href="/register" className={`${Styles.btn} ${Styles.secondaryBtn}`}>
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
            <Image
              src={session.user.image || DefaultImage}
              alt="User Avatar"
              className={Styles.avatar}
              width={100}
              height={100}
              priority
            />
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
                onClick={() => signOut({ callbackUrl: "/login" })}
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