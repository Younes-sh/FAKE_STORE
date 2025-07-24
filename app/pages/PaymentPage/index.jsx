// pages/PaymentPage/index.jsx
import { useState, useEffect } from 'react';
import styles from './paymentPage.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AppContext } from '@/pages/_app';
import { useContext } from 'react';

const PaymentPage = () => {
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
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
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
      const res = await fetch('/api/getUser');
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
    fetchCart();
    fetchUserAddress();
  }, []);

  useEffect(() => {
    if (paymentSuccess) {
      const timeout = setTimeout(() => {
        router.push('/profile');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [paymentSuccess]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.count), 0);
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // اعتبارسنجی قوی‌تر
    const isAddressValid = shippingAddress.street.trim() && shippingAddress.city.trim() && shippingAddress.country.trim();
    if (!isAddressValid) {
      setError('Please fill in all required address fields (street, city, country) with valid values');
      setIsProcessing(false);
      return;
    }

    console.log('Sending order data:', {
      paymentMethod: 'credit_card',
      shippingAddress,
      subtotal: totalAmount,
      shippingFee: 0,
      taxAmount: 0,
      totalAmount,
      items: cartItems.map(item => ({
        _id: item._id,
        count: item.count || item.quantity,
        productName: item.productName,
        price: item.price,
        totalPrice: item.totalPrice,
        image: item.image,
        description: item.description,
        section: item.section,
        model: item.model,
      })),
    });

    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'credit_card',
          shippingAddress: {
            street: shippingAddress.street.trim(),
            city: shippingAddress.city.trim(),
            postalCode: shippingAddress.postalCode.trim(),
            country: shippingAddress.country.trim(),
            number: shippingAddress.number.trim(),
            floor: shippingAddress.floor.trim(),
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
            model: item.model,
          })),
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Error placing order');
      }

      const orderData = await orderResponse.json();
      setAddToCard(0);
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value.trim() }));
  };

  if (loadingCart || loadingAddress) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>!</div>
        <h3>{error}</h3>
        <button className={styles.retryButton} onClick={() => { fetchCart(); fetchUserAddress(); }}>
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
      <button className={styles.backButton} onClick={() => router.back()}>
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
            {/* فرم آدرس */}
            <div className={styles.formGroup}>
              <label htmlFor="street">Street Address</label>
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
              <label htmlFor="city">City</label>
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

            {/* فرم پرداخت */}
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