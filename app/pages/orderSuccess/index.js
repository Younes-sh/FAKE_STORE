import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from './OrderSuccess.module.css';
import { useContext } from 'react';
import { AppContext } from '../_app';

export default function OrderSuccess() {
  const router = useRouter();
  const { orders } = useContext(AppContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const { orderId } = router.query;
  if (!orderId) return;

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data.order);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchOrder();
}, [router.query]);


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/')}>Return to Home</button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <h2>No Order Found</h2>
        <p>We couldn &apos;t find your order details.</p>
        <button onClick={() => router.push('/')}>Return to Home</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmation</title>
        <meta name="description" content="Your order confirmation" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Thank You for Your Order!</h1>
          <p className={styles.orderNumber}>Order #: {order.id}</p>
          <p className={styles.orderDate}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          
          <div className={styles.itemsContainer}>
            {order.items.map(item => (
              <div key={item._id} className={styles.orderItem}>
                <div className={styles.itemImage}>
                  <Image 
                    src={item.image} 
                    alt={item.productName} 
                    width={100}
                    height={100}
                    objectFit="contain"
                  />
                </div>
                <div className={styles.itemDetails}>
                  <h4>{item.productName}</h4>
                  <div className={styles.itemMeta}>
                    <span>Quantity: {item.count}</span>
                    <span>Price: ${item.price}</span>
                    <span>Total: ${item.totalPrice}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderTotal}>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span>${order.totalAmount}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className={styles.totalRow}>
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total:</span>
              <span>${order.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className={styles.shippingInfo}>
          <h2>Shipping Information</h2>
          <div className={styles.infoGrid}>
            <div>
              <h3>Shipping Address</h3>
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
            <div>
              <h3>Payment Method</h3>
              <p>{order.paymentMethod === 'online' ? 'Online Payment' : 'Cash on Delivery'}</p>
              <p>Status: Paid</p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => window.print()} className={styles.printButton}>
            Print Receipt
          </button>
          <button onClick={() => router.push('/')} className={styles.continueButton}>
            Continue Shopping
          </button>
        </div>
      </div>
    </>
  );
}