import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Styles from './profile.module.css';
import { useState } from 'react';
import Image from 'next/image';
import EditProfileModal from '@/Components/Profile/EditProfile/EditProfileModal';
import DefaultImage from '@/public/user.png';
import Tabs from '@/Components/Profile/TabProfile/TabProfile';


export default function ProfilePage() {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('purchases');



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

  const joinDate = new Date(session.user.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Sample product data
  const purchasedProducts = [
    { id: 1, name: 'ASUS Laptop', date: '2023-08-05', status: 'Delivered' },
    { id: 2, name: 'Wireless Headphones', date: '2023-09-12', status: 'Shipping' },
    { id: 3, name: 'Gaming Mouse', date: '2023-10-01', status: 'Cancelled' }
  ];

  const favoriteProducts = [
    { id: 4, name: 'Mechanical Keyboard', price: '$120' },
    { id: 5, name: '27-inch Monitor', price: '$450' },
    { id: 6, name: 'Bluetooth Speaker', price: '$85' }
  ];

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
          <h1 className={Styles.userName}>{session.user.name}</h1>
          <p className={Styles.userEmail}>{session.user.email}</p>
          {/* <p className={Styles.joinDate}>Member since {joinDate}</p> */}
        </div>

        {/* Profile Content */}
        <div className={Styles.profileContent}>
          {/* User Activity Tabs */}
          {/* <div className={Styles.tabs}>
            <button 
              className={`${Styles.tab} ${activeTab === 'purchases' ? Styles.activeTab : ''}`}
              onClick={() => setActiveTab('purchases')}
            >
              My Purchases
            </button>
            <button 
              className={`${Styles.tab} ${activeTab === 'favorites' ? Styles.activeTab : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button 
              className={`${Styles.tab} ${activeTab === 'tracking' ? Styles.activeTab : ''}`}
              onClick={() => setActiveTab('tracking')}
            >
              Order Trackinggit
            </button>
          </div> */}

          {/* Tab Content */}
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