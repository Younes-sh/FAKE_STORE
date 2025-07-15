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
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error('سفارش یافت نشد');
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
        <p>در حال دریافت جزئیات سفارش...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>خطا در دریافت سفارش</h2>
        <p>{error}</p>
        <button 
          className={styles.homeButton}
          onClick={() => router.push('/')}
        >
          <FiHome /> بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h2>سفارشی یافت نشد</h2>
        <p>متاسفانه اطلاعات سفارش شما موجود نیست</p>
        <button 
          className={styles.homeButton}
          onClick={() => router.push('/')}
        >
          <FiHome /> بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>تأیید سفارش | فروشگاه شما</title>
        <meta name="description" content="جزئیات سفارش شما" />
      </Head>

      <div className={styles.container}>
        <div className={styles.confirmationHeader}>
          <div className={styles.successIcon}>
            <FiCheckCircle />
          </div>
          <h1>سفارش شما با موفقیت ثبت شد!</h1>
          <p className={styles.confirmationText}>
            از خرید شما متشکریم. جزئیات سفارش به ایمیل شما ارسال شد.
          </p>
        </div>

        <div className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <h2>خلاصه سفارش</h2>
            <div className={styles.orderMeta}>
              <span>
                <strong>شماره سفارش:</strong> {order.orderNumber || order._id}
              </span>
              <span>
                <strong>تاریخ:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '---'}
              </span>
              <span>
                <strong>وضعیت:</strong> {order.status === 'completed' ? 'تکمیل شده' : 'در حال پردازش'}
              </span>
            </div>
          </div>

          <div className={styles.productsList}>
            <h3>محصولات</h3>
            {order.items.map((item) => (
              <div key={item._id} className={styles.productItem}>
                <div className={styles.productImage}>
                  <Image
                    src={item.image || '/images/default-product.png'}
                    alt={item.name || 'محصول'}
                    width={80}
                    height={80}
                    objectFit="contain"
                  />
                </div>
                <div className={styles.productDetails}>
                  <h4>{item.name}</h4>
                  <div className={styles.productMeta}>
                    <span>تعداد: {item.quantity || 0}</span>
                    <span>قیمت واحد: {item.priceAtPurchase ? item.priceAtPurchase.toLocaleString() : '۰'} تومان</span>
                  </div>
                </div>
                <div className={styles.productTotal}>
                  {(item.priceAtPurchase && item.quantity) ? (item.priceAtPurchase * item.quantity).toLocaleString() : '۰'} تومان
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>جمع کل:</span>
              <span>{order.totalAmount ? order.totalAmount.toLocaleString() : '۰'} تومان</span>
            </div>
            <div className={styles.totalRow}>
              <span>هزینه ارسال:</span>
              <span>رایگان</span>
            </div>
            <div className={`${styles.totalRow} ${styles.grandTotal}`}>
              <span>مبلغ قابل پرداخت:</span>
              <span>{order.totalAmount ? order.totalAmount.toLocaleString() : '۰'} تومان</span>
            </div>
          </div>
        </div>

        <div className={styles.infoCards}>
          <div className={styles.infoCard}>
            <h3>اطلاعات ارسال</h3>
            <div className={styles.infoContent}>
              <p>
                <strong>آدرس:</strong> {order.shippingAddress?.address || '---'}
              </p>
              <p>
                <strong>شهر:</strong> {order.shippingAddress?.city || '---'}
              </p>
              <p>
                <strong>کد پستی:</strong> {order.shippingAddress?.postalCode || '---'}
              </p>
              <p>
                <strong>کشور:</strong> {order.shippingAddress?.country || '---'}
              </p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h3>روش پرداخت</h3>
            <div className={styles.infoContent}>
              <p>
                <strong>نوع پرداخت:</strong> 
                {order.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'پرداخت با کارت'}
              </p>
              <p>
                <strong>وضعیت پرداخت:</strong> پرداخت شده
              </p>
              <p>
                <strong>تاریخ پرداخت:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fa-IR') : '---'}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            onClick={() => window.print()} 
            className={styles.printButton}
          >
            <FiPrinter /> چاپ فاکتور
          </button>
          <button 
            onClick={() => router.push('/products')} 
            className={styles.continueButton}
          >
            <FiShoppingBag /> ادامه خرید
          </button>
        </div>

        <div className={styles.footerNote}>
          <p>
            در صورت هرگونه سوال یا مشکل می‌توانید با پشتیبانی ما تماس بگیرید.
          </p>
          <p>ساعات کاری: شنبه تا پنجشنبه، ۹ صبح تا ۵ بعدازظهر</p>
        </div>
      </div>
    </>
  );
}
