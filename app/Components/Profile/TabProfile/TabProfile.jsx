import { useState } from 'react';
import styles from './tab.module.css';
import PurchasesTab from '../EditProfile/PurchasesTab/PurchasesTab';
import FavoritesTab from '../EditProfile/FavoritesTab/FavoritesTab';
import TrackingTab from '../EditProfile/TrackingTab/TrackingTab';
import MyOrdersTab from '../EditProfile/MyOrders/MyOrders';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
        >
          My Orders
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`${styles.tabButton} ${activeTab === 'purchases' ? styles.active : ''}`}
        >
          Purchases
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`${styles.tabButton} ${activeTab === 'tracking' ? styles.active : ''}`}
        >
          Order Tracking
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'orders' && <MyOrdersTab />}
        {activeTab === 'purchases' && <PurchasesTab />}
        {activeTab === 'favorites' && <FavoritesTab />}
        {activeTab === 'tracking' && <TrackingTab />}
      </div>
    </div>
  );
}
