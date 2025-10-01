import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './MyOrders.module.css';
import Link from 'next/link';
import OrderCard from './OrderCard';

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // در MyOrders.js - اضافه کردن دیباگ پیشرفته
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('🔄 Fetching orders for user...');
        const response = await fetch('/api/orders');
        console.log('📨 Response status:', response.status);
        
        const data = await response.json();
        console.log('📊 Full response data:', data);
        
        if (data.success) {
          console.log(`✅ Loaded ${data.orders.length} orders`);
          console.log('📦 Orders structure:', data.orders);
          setOrders(data.orders);
        } else {
          console.error('❌ API error:', data.message);
          setError(data.message);
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);

  if (loading) return <div className={styles.loading}>Loading orders...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <Head>
        <title>My Orders</title>
      </Head>
      
      <h1 className={styles.title}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't placed any orders yet.</p>
          <Link href="/products" className={styles.shopLink}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map(order => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}