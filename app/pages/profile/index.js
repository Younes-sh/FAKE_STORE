import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Styles from './profile.module.css';
import { useState } from 'react';
import Image from 'next/image';
import EditProfileModal from '@/Components/Profile/EditProfile/EditProfileModal';

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
            src={session.user.image || '/default-avatar.jpg'} 
            alt="User Avatar" 
            className={Styles.avatar}
            width={100}
            height={100}
          />
          <h1 className={Styles.userName}>{session.user.name}</h1>
          <p className={Styles.userEmail}>{session.user.email}</p>
          <p className={Styles.joinDate}>Member since {joinDate}</p>
        </div>

        {/* Profile Content */}
        <div className={Styles.profileContent}>
          {/* User Activity Tabs */}
          <div className={Styles.tabs}>
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
              Order Tracking
            </button>
          </div>

          {/* Tab Content */}
          <div className={Styles.tabContent}>
            {activeTab === 'purchases' && (
              <div>
                <h3 className={Styles.tabTitle}>Purchase History</h3>
                <div className={Styles.productsList}>
                  {purchasedProducts.map(product => (
                    <div key={product.id} className={Styles.productItem}>
                      <div className={Styles.productInfo}>
                        <h4>{product.name}</h4>
                        <p>Purchase Date: {product.date}</p>
                        <p className={Styles[`status-${product.status.toLowerCase()}`]}>
                          Status: {product.status}
                        </p>
                      </div>
                      <button className={`${Styles.btn} ${Styles.smallBtn}`}>
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h3 className={Styles.tabTitle}>Favorite Products</h3>
                <div className={Styles.favoritesGrid}>
                  {favoriteProducts.map(product => (
                    <div key={product.id} className={Styles.favoriteItem}>
                      <div className={Styles.favoriteImage}>
                        <Image 
                          src={`/products/${product.id}.jpg`} 
                          alt={product.name}
                          width={80}
                          height={80}
                        />
                      </div>
                      <div className={Styles.favoriteDetails}>
                        <h4>{product.name}</h4>
                        <p>{product.price}</p>
                      </div>
                      <div className={Styles.favoriteActions}>
                        <button className={`${Styles.btn} ${Styles.smallBtn}`}>
                          Add to Cart
                        </button>
                        <button className={`${Styles.btn} ${Styles.smallBtn} ${Styles.dangerBtn}`}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tracking' && (
              <div>
                <h3 className={Styles.tabTitle}>Track Your Order</h3>
                <div className={Styles.trackingForm}>
                  <input 
                    type="text" 
                    placeholder="Enter order number or tracking code"
                    className={Styles.trackingInput}
                  />
                  <button className={`${Styles.btn} ${Styles.primaryBtn}`}>
                    Track
                  </button>
                </div>
                <div className={Styles.trackingInfo}>
                  {/* Tracking information will appear here */}
                </div>
              </div>
            )}
          </div>

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