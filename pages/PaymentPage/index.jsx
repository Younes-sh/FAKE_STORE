// pages/PaymentPage/index.jsx
import { useState, useEffect } from 'react';
import styles from './paymentPage.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppContext } from '@/pages/_app';
import { useContext } from 'react';
import { useSession } from "next-auth/react";
import { useCart } from '@/contexts/CartContext';

const PaymentPage = () => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(true);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [expiryError, setExpiryError] = useState('');
  
  // استفاده از CartContext
  const { clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    number: '',
    floor: '',
    country: '',
  });
  
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);

  // Fetch cart from API
  const fetchCartData = async () => {
    try {
      const res = await fetch(`/api/cart`);
      if (!res.ok) throw new Error('Error fetching cart');
      const data = await res.json();
      setCartItems(data.cart?.products || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Error fetching cart');
    } finally {
      setLoadingCart(false);
    }
  };

  // Fetch user address
  const fetchUserAddress = async () => {
    try {
      const res = await fetch(`/api/getUser`);
      if (!res.ok) throw new Error('Error fetching user address');
      const data = await res.json();
      console.log('User data from API:', data);
      if (data.address) {
        setShippingAddress({
          street: data.address.street || '',
          city: data.address.city || '',
          postalCode: data.address.postalCode || '',
          country: data.address.country || '',
          number: data.address.number || '',
          floor: data.address.floor || '',
        });
      } else {
        console.warn('No address found in user data');
      }
    } catch (error) {
      console.error('Error fetching user address:', error);
      setError('Error fetching user address: ' + error.message);
    } finally {
      setLoadingAddress(false);
    }
  };

  useEffect(() => {
    fetchCartData();
    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      const timeout = setTimeout(() => {
        router.push(`/profile`);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [paymentSuccess]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.count), 0);
  };

  const totalAmount = calculateTotal();

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Checking login session... Please wait.</p>
      </div>
    );
  }

  // تابع handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!session) {
      setError("You need to be logged in to place an order.");
      setIsProcessing(false);
      router.push("/auth/login");
      return;
    }

    // اعتبارسنجی تاریخ انقضا
    if (!validateExpiry()) {
      setIsProcessing(false);
      return;
    }

    try {
      // 1. ایجاد سفارش
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          products: cartItems,
          shippingAddress,
          totalAmount,
          paymentMethod: "online",
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => null);
        throw new Error(errorData?.message || `Order creation failed: ${orderResponse.status}`);
      }

      const orderData = await orderResponse.json();
      console.log("✅ Order created successfully:", orderData);

      // 2. پاک کردن سبد خرید
      console.log("🔄 Clearing cart after successful order...");
      
      const clearSuccess = await clearCart();
      
      if (!clearSuccess) {
        // روش جایگزین: استفاده مستقیم از API
        console.log("⚠️ Trying direct API call for clearing cart...");
        const clearCartRes = await fetch('/api/cart/clear', {
          method: 'DELETE',
        });

        if (!clearCartRes.ok) {
          console.warn("Cart clearing failed, but order was created");
        }
      }

      // 3. به روزرسانی stateهای محلی
      setCartItems([]);
      if (setAddToCard) {
        setAddToCard(0);
      }

      // 4. اطلاع‌رسانی به تمام کامپوننت‌ها
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      console.log("✅ Cart cleared successfully");

      // 5. نمایش موفقیت و هدایت
      setPaymentSuccess(true);
      setTimeout(() => {
        router.push(`/orderSuccess?orderId=${orderData.order._id}`);
      }, 2000);

    } catch (error) {
      console.error("❌ Payment or cart clearing failed:", error);
      setError(error.message || "Payment failed. Please try again.");
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value;
    const position = e.target.selectionStart;
    
    value = value.replace(/[^0-9/]/g, '');
    
    if (position === 3 && value.length === 4 && value[2] !== '/') {
      value = value.substring(0, 2) + value.substring(3);
    }
    
    if (value.length === 2 && position === 2 && !value.includes('/')) {
      value = value + '/';
    }
    
    if (value.length > 5) {
      value = value.substring(0, 5);
    }
    
    setExpiry(value);
    setExpiryError('');
  };

  const validateExpiry = () => {
    if (!expiry) {
      setExpiryError('Expiration date is required');
      return false;
    }
    
    const parts = expiry.split('/');
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
      setExpiryError('Invalid format (MM/YY)');
      return false;
    }
    
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    
    if (month < 1 || month > 12) {
      setExpiryError('Month must be between 01-12');
      return false;
    }
    
    // بررسی تاریخ انقضا (اختیاری)
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setExpiryError('Card has expired');
      return false;
    }
    
    return true;
  };

  const handleExpiryBlur = () => {
    validateExpiry();
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handleCardNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardName(value);
  };

  if (loadingCart || loadingAddress) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your information...</p>
      </div>
    );
  }

  if (error && !isProcessing) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className={styles.retryButton} 
          onClick={() => { 
            setError(null);
            fetchCartData(); 
            fetchUserAddress(); 
          }}
        >
          Try Again
        </button>
        <button 
          className={styles.backButton} 
          onClick={() => router.push('/basket')}
        >
          Back to Cart
        </button>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Payment Successful!</h2>
        <p>Your order has been confirmed and your cart has been cleared.</p>
        <p>Redirecting to order confirmation page...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={() => router.push('/basket')}>
        ← Back to Cart
      </button>

      <h1 className={styles.pageTitle}>Complete Your Payment</h1>

      <div className={styles.contentWrapper}>
        {/* سمت چپ: خلاصه سبد خرید */}
        <div className={styles.cartSummary}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>

          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Your cart is empty</p>
              <button 
                className={styles.continueShopping}
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className={styles.itemsList}>
                {cartItems.map(item => (
                  <div key={item._id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <Image
                        src={item.image || '/images/placeholder-product.jpg'}
                        width={80}
                        height={80}
                        alt={item.productName}
                        onError={(e) => {
                          e.target.src = '/images/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h4>{item.productName}</h4>
                      <p>Quantity: {item.count}</p>
                      <p className={styles.unitPrice}>
                        ${(item.price || 0).toFixed(2)} each
                      </p>
                    </div>
                    <div className={styles.itemPrice}>
                      ${((item.totalPrice || item.price * item.count) || 0).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.summaryTotal}>
                <div className={styles.subtotal}>
                  <span>Subtotal:</span>
                  <span>${cartItems.reduce((sum, item) => sum + (item.price * item.count), 0).toFixed(2)}</span>
                </div>
                <div className={styles.shipping}>
                  <span>Shipping:</span>
                  <span>$0.00</span>
                </div>
                <div className={styles.total}>
                  <span>Total:</span>
                  <span className={styles.totalAmount}>
                    ${cartItems.reduce((sum, item) => sum + (item.totalPrice || item.price * item.count), 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* سمت راست: فرم پرداخت */}
        <div className={styles.paymentSection}>
          <div className={styles.paymentForm}>
            <h2 className={styles.sectionTitle}>Shipping Information</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="street">Street Address *</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main St"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  placeholder="Tehran"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleAddressChange}
                  placeholder="1234567890"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="country">Country *</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                  placeholder="Iran"
                  required
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="number">Building Number</label>
                <input
                  type="text"
                  id="number"
                  name="number"
                  value={shippingAddress.number}
                  onChange={handleAddressChange}
                  placeholder="No. 10"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="floor">Floor</label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  value={shippingAddress.floor}
                  onChange={handleAddressChange}
                  placeholder="2nd Floor"
                />
              </div>
            </div>
          </div>

          <div className={styles.paymentForm}>
            <h2 className={styles.sectionTitle}>Payment Details</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber">Card Number *</label>
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
              <label htmlFor="cardName">Cardholder Name *</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={handleCardNameChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="expiry">Expiration Date (MM/YY) *</label>
                <input
                  type="text"
                  id="expiry"
                  value={expiry}
                  onChange={handleExpiryChange}
                  onBlur={handleExpiryBlur}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
                {expiryError && <span className={styles.errorMessage}>{expiryError}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={handleCvvChange}
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
              onClick={handleSubmit}
            >
              {isProcessing ? (
                <>
                  <div className={styles.spinnerSmall}></div>
                  Processing Payment...
                </>
              ) : (
                `Confirm and Pay $${totalAmount.toFixed(2)}`
              )}
            </button>

            {cartItems.length === 0 && (
              <p className={styles.emptyCartMessage}>
                Your cart is empty. Please add items to proceed with payment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;