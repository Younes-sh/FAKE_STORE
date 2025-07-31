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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
      
    };

    fetchOrders();
    // وقتی route تغییر می‌کند دوباره fetch کن
    router.events.on('routeChangeComplete', fetchOrders);
    return () => {
      router.events.off('routeChangeComplete', fetchOrders);
    };
  }, [router]);

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