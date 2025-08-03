import { useState } from 'react';
import styles from './tab.module.css';
import PurchasesTab from '../EditProfile/PurchasesTab/PurchasesTab';
import FavoritesTab from '../EditProfile/FavoritesTab/FavoritesTab';
import TrackingTab from '../EditProfile/TrackingTab/TrackingTab';
import MyOrdersTab from '../EditProfile/MyOrders/myOrders';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className={styles.tabsWrapper}>
      <div className={styles.tabHeader}>
        <button
          onClick={() => setActiveTab('orders')}
          className={`${styles.tabButton} ${activeTab === 'orders' ? styles.active : ''}`}
          aria-selected={activeTab === 'orders'}
          role="tab"
        >
          My Orders
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`${styles.tabButton} ${activeTab === 'purchases' ? styles.active : ''}`}
          aria-selected={activeTab === 'purchases'}
          role="tab"
        >
          Purchases
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
          aria-selected={activeTab === 'favorites'}
          role="tab"
        >
          Favorites
        </button>
        <button
          onClick={() => setActiveTab('tracking')}
          className={`${styles.tabButton} ${activeTab === 'tracking' ? styles.active : ''}`}
          aria-selected={activeTab === 'tracking'}
          role="tab"
        >
          Order Tracking
        </button>
      </div>

      <div  role="tabpanel">
        {activeTab === 'orders' && <MyOrdersTab />}
        {activeTab === 'purchases' && <PurchasesTab />}
        {activeTab === 'favorites' && <FavoritesTab />}
        {activeTab === 'tracking' && <TrackingTab />}
      </div>
    </div>
  );
}