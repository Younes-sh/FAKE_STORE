// pages/PaymentPage/index.jsx
import { useState, useEffect } from 'react';
import styles from './paymentPage.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppContext } from '@/pages/_app';
import { useContext } from 'react';

const PaymentPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);

  // Fetch cart from API
  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Error fetching cart");
      const data = await res.json();
      setCartItems(data.cart?.products || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Error fetching cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      const timeout = setTimeout(() => {
        router.push("/profile");
      }, 3000); // Redirect after 3 seconds

      return () => clearTimeout(timeout);
    }
  }, [paymentSuccess]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.count);
    }, 0);
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: "credit_card", // ✅ Valid value
          shippingAddress: {
            address: "Sample address",
            city: "Tehran",
            postalCode: "1234567890",
          },
          subtotal: totalAmount,
          shippingFee: 0,
          taxAmount: 0,
          totalAmount: totalAmount,
          items: cartItems.map(item => ({
            _id: item._id,
            count: item.count || item.quantity,
            productName: item.productName,
            price: item.price,
            totalPrice: item.totalPrice,
            image: item.image,
            description: item.description,
            section: item.section,
            model: item.model
          }))
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Error placing order');
      }

      const orderData = await orderResponse.json();

      setAddToCard(0); // Reset cart count after successful order
      setPaymentSuccess(true);
      router.push(`/orderSuccess?orderId=${orderData.order._id}`);

    } catch (error) {
      console.error('Payment error:', error);
      setError('Payment error: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h3>{error}</h3>
        <button 
          className={styles.retryButton}
          onClick={fetchCart}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Payment was successful</h2>
        <p>Redirecting to payment confirmation page...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => router.back()}
      >
        ← Back to cart
      </button>

      <h1 className={styles.pageTitle}>Complete payment process</h1>
      
      <div className={styles.contentWrapper}>
        <div className={styles.cartSummary}>
          <h2 className={styles.sectionTitle}>Order summary</h2>
          
          {cartItems.length === 0 ? (
            <p className={styles.emptyCart}>Your cart is empty</p>
          ) : (
            <>
              <div className={styles.itemsList}>
                {cartItems.map(item => (
                  <div key={item._id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image 
                        src={item.image || '/default-product.png'}
                        width={80}
                        height={80}
                        alt={item.productName}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.productName}</h4>
                      <p>Quantity: {item.count}</p>
                    </div>
                    <div className={styles.itemPrice}>
                      ${(item.totalPrice || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.summaryTotal}>
                <span>Total:</span>
                <span className={styles.totalAmount}>
                  ${cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0).toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className={styles.paymentForm}>
          <h2 className={styles.sectionTitle}>Payment information</h2>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="cardName">Cardholder name</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="expiry">Expiration date</label>
                <input
                  type="text"
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength="3"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isProcessing || cartItems.length === 0}
            >
              {isProcessing ? 'Processing payment...' : 'Confirm and pay'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;