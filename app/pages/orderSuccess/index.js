// pages/orderSuccess.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from './OrderSuccess.module.css';
import { FiCheckCircle, FiPrinter, FiShoppingBag, FiHome } from 'react-icons/fi';

export default function OrderSuccess() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { orderId } = router.query;
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${orderId}`);
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
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>Error in receiving order</h2>
        <p>{error}</p>
        <button
          className={styles.homeButton}
          onClick={() => router.push('/')}
        >
          <FiHome /> Return to home page
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>No order found</h2>
        <p>Unfortunately, your order information is not available</p>
        <button
          className={styles.homeButton}
          onClick={() => router.push('/')}
        >
          <FiHome /> Return to home page
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order Confirmation | Your Store</title>
        <meta name="description" content="Your order details" />
      </Head>

      <div className={styles.container}>
        <div className={styles.confirmationHeader}>
          <div className={styles.successIcon}>
            <FiCheckCircle />
          </div>
          <h1>Your order has been successfully registered!</h1>
          <p className={styles.confirmationText}>
            Thank you for your purchase. Order details have been sent to your email.
          </p>
        </div>

        <div className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <h2>Order Summary</h2>
            <div className={styles.orderMeta}>
              <span>
                <strong>Order number:</strong> {order.orderNumber || order._id}
              </span>
              <span>
                <strong>Date:</strong>{' '}
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : '---'}
              </span>
              <span>
                <strong>Status:</strong> {order.status === 'completed' ? 'Completed' : 'Processing'}
              </span>
            </div>
          </div>

          <div className={styles.productsList}>
            <h3>Products</h3>
            {order.items.map((item) => (
              <div key={item._id} className={styles.productItem}>
                <div className={styles.productImage}>
                  <Image
                    src={item.image || '/images/default-product.png'}
                    alt={item.name || 'Product'}
                    width={80}
                    height={80}
                    objectFit="contain"
                  />
                </div>
                <div className={styles.productDetails}>
                  <h4>{item.name}</h4>
                  <div className={styles.productMeta}>
                    <span>Quantity: {item.quantity || 0}</span>
                    <span>Unit price: {item.priceAtPurchase ? item.priceAtPurchase.toLocaleString() : '0'} $</span>
                  </div>
                </div>
                <div className={styles.productTotal}>
                  {(item.priceAtPurchase && item.quantity)
                    ? (item.priceAtPurchase * item.quantity).toLocaleString()
                    : '0'}{' '}
                  $
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span>{order.totalAmount ? order.totalAmount.toLocaleString() : '0'} $</span>
            </div>
            <div className={styles.totalRow}>
              <span>Shipping cost:</span>
              <span>Free</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>Total amount:</span>
              <span>{order.totalAmount ? order.totalAmount.toLocaleString() : '0'} $</span>
            </div>
          </div>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <h3>Customer Information</h3>
            <div className={styles.infoContent}>
              <p>
                <strong>Name:</strong> {order.user?.firstname} {order.user?.lastname}
              </p>
              <p>
                <strong>Email:</strong> {order.user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {order.user?.phone}
              </p>
              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress?.street}, {order.shippingAddress?.city},{' '}
                {order.shippingAddress?.postalCode || '---'}
              </p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>Payment Method</h3>
            <div className={styles.infoContent}>
              <p>
                <strong>Payment type: </strong>
                {order.paymentMethod === 'online' ? 'Online Payment' : 'Card Payment'}
              </p>
              <p>
                <strong>Payment status:</strong> Paid
              </p>
              <p>
                <strong>Payment date:</strong>{' '}
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US') : '---'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button onClick={() => window.print()} className={styles.printButton}>
            <FiPrinter /> Print invoice
          </button>
          <button onClick={() => router.push('/products')} className={styles.continueButton}>
            <FiShoppingBag /> Continue shopping
          </button>
        </div>

        <div className={styles.footerNote}>
          <p>If you have any questions or problems, you can contact our support.</p>
          <p>Working hours: Saturday to Thursday, 9 AM to 5 PM</p>
        </div>
      </div>
    </>
  );
}