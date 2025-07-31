import Link from 'next/link';
import Image from 'next/image';
import styles from './OrderCard.module.css';

export default function OrderCard({ order }) {
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderHeader}>
        <div>
          <span className={styles.orderLabel}>Order #</span>
          <span className={styles.orderNumber}>{order.orderNumber}</span>
        </div>
        <div>
          <span className={styles.orderLabel}>Date</span>
          <span className={styles.orderDate}>{orderDate}</span>
        </div>
        <div>
          <span className={styles.orderLabel}>Total</span>
          <span className={styles.orderTotal}>${order.totalAmount.toFixed(2)}</span>
        </div>
        <div>
          <span className={styles.orderLabel}>Status</span>
          <span className={`${styles.orderStatus} ${styles[order.status]}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className={styles.productsPreview}>
        {order.items.slice(0, 6).map((item, index) => (
          <div key={index} className={styles.productThumbnail}>
            <Image 
              src={item.image} 
              alt={item.name} 
              width={60} 
              height={60} 
              className={styles.productImage}
            />
          </div>
        ))}
        {order.items.length > 6 && (
          <div className={styles.moreItems}>+{order.items.length - 3} more</div>
        )}
      </div>

      <div className={styles.orderFooter}>
        <Link href={`/orderSuccess?orderId=${order._id}`} className={styles.viewButton}>
          View Order
        </Link>
      </div>
    </div>
  );
}