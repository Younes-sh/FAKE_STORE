import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Styles from './profile.module.css';
import { useState } from 'react';
import Image from 'next/image';
import EditProfileModal from '@/Components/Profile/EditProfile/EditProfileModal';
import DefaultImage from '@/public/user.png';
import Tabs from '@/Components/Profile/TabProfile/TabProfile';
import { useRouter } from 'next/router';



export default function ProfilePage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('purchases');

  const router = useRouter();

  if (!session) {
    return (
      <div className={Styles.profileContainer}>
        <div className={Styles.profileCard} style={{ gridTemplateColumns: '1fr' }}>
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

  return (
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
          />
          <div className={Styles.userInfo}>
            <h1 className={Styles.userName}>{session.user.name}</h1>
            <p className={Styles.userEmail}>{session.user.email}</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className={Styles.profileContent}>
         <Tabs />

          {/* Account Settings */}
          <h2 className={Styles.sectionTitle}>Account Settings</h2>
          <ul className={Styles.settingsList}>
            <li className={Styles.settingItem}>
              <span className={Styles.settingLabel}>Dark Mode</span>
              <label className={Styles.toggleSwitch}>
                <input 
                  type="checkbox" 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                />
                <span className={Styles.slider}></span>
              </label>
            </li>
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
              onClick={() => signOut()}
              className={`${Styles.btn} ${Styles.dangerBtn}`}
            >
              Logout
            </button>
          </div>
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
  );
}