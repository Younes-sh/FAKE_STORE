import { useContext, useState, useEffect } from 'react';
import { AppContext } from '@/pages/_app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './MyOrders.module.css';

export default function MyOrders() {
  const { orders, addProduct } = useContext(AppContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    // شبیه‌سازی بارگذاری داده‌ها
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilteredOrders(orders);
    }, 500);

    return () => clearTimeout(timer);
  }, [orders]);

  const handleViewDetails = (orderId) => {
    router.push(`/orderSuccess?orderId=${orderId}`);
  };

  const handleContinueShopping = () => {
    router.push('/products'); // یا مسیر مناسب دیگر
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Orders - Your Store</title>
        <meta name="description" content="View your order history" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Orders</h1>
          {addProduct.length > 0 && (
            <Link href="/BasketPage" className={styles.cartLink}>
              View Cart ({addProduct.length} items)
            </Link>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <img src="/images/empty-orders.svg" alt="No orders" className={styles.emptyImage} />
            <h2>You haven't placed any orders yet</h2>
            <p>Start shopping to see your orders here</p>
            <button 
              onClick={handleContinueShopping}
              className={styles.continueButton}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className={styles.ordersContainer}>
            <div className={styles.sortOptions}>
              <select 
                onChange={(e) => {
                  const sorted = [...orders];
                  if (e.target.value === 'newest') {
                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  } else {
                    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                  }
                  setFilteredOrders(sorted);
                }}
                className={styles.sortSelect}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className={styles.ordersList}>
              {filteredOrders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3>Order #{order.id.slice(0, 8)}</h3>
                      <span className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <span className={`${styles.status} ${styles[order.status || 'completed']}`}>
                      {order.status || 'Completed'}
                    </span>
                  </div>
                  
                  <div className={styles.orderBody}>
                    <div className={styles.itemsPreview}>
                      {order.items.slice(0, 3).map(item => (
                        <div key={item._id} className={styles.itemPreview}>
                          <img 
                            src={item.image || '/images/product-placeholder.jpg'} 
                            alt={item.productName} 
                            onError={(e) => {
                              e.target.src = '/images/product-placeholder.jpg';
                            }}
                          />
                          <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.productName}</span>
                            <span className={styles.itemQuantity}>
                              {item.count} × ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}
                            </span>

                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className={styles.moreItems}>
                          +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.orderFooter}>
                      <div className={styles.totalAmount}>
                        <span>Total:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className={styles.detailsButton}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}