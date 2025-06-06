import { useState } from 'react';
import styles from './paymentPage.module.css';
import { useContext } from 'react';
import { AppContext } from '@/Components/AppContextProvider';
import { useRouter } from 'next/router';

const PaymentPage = () => {
  const { addProduct, setAddProduct,addToCard, setAddToCard, orders, setOrders } = useContext(AppContext);
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  // الگوریتم Luhn برای اعتبارسنجی شماره کارت
  const luhnCheck = (num) => {
    let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
    let sum = arr.reduce((acc, val, idx) => {
      if (idx % 2) {
        val *= 2;
        if (val > 9) val -= 9;
      }
      return acc + val;
    }, 0);
    return sum % 10 === 0;
  };

  const validate = () => {
    const newErrors = {};
    setGeneralError('');

    // شماره کارت: فقط اعداد، 16 رقم و الگوریتم Luhn
    const cardNumberDigits = cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumberDigits)) {
      newErrors.cardNumber = 'Card number must be exactly 16 digits.';
    } else if (!luhnCheck(cardNumberDigits)) {
      newErrors.cardNumber = 'Card number is invalid.';
    }

    // نام دارنده کارت: فقط حروف و فاصله، حداقل 3 کاراکتر
    if (!cardName.trim() || cardName.trim().length < 3) {
      newErrors.cardName = 'Cardholder name is too short.';
    } else if (!/^[a-zA-Z\s\u0600-\u06FF]+$/.test(cardName.trim())) {
      newErrors.cardName = 'Cardholder name must only contain letters.';
    }

    // تاریخ انقضا: فرمت MM/YY و معتبر بودن ماه و سال
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      newErrors.expiry = 'Expiry must be in MM/YY format.';
    } else {
      const [mm, yy] = expiry.split('/');
      const expMonth = parseInt(mm, 10);
      const expYear = 2000 + parseInt(yy, 10);
      const now = new Date();
      const expiryDate = new Date(expYear, expMonth - 1, 1);
      if (expiryDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
        newErrors.expiry = 'Card has expired.';
      }
    }

    // CVV: فقط 3 یا 4 رقم
    if (!/^\d{3,4}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsProcessing(true);
    setGeneralError('');
    setTimeout(() => {
      try {
        // اگر سبد خرید خالی بود
        if (!addProduct || addProduct.length === 0) {
          setIsProcessing(false);
          setGeneralError('Your cart is empty.');
          return;
        }
        // 1. ایجاد سفارش جدید
        const newOrder = {
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          items: [...addProduct],
          totalAmount: addProduct.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
          shippingAddress: {
            fullName: cardName || "Unknown",
            address: "Not specified",
            city: "Not specified",
            postalCode: "00000",
            phone: "Not specified"
          },
          paymentMethod: "online",
          status: "completed"
        };

        // 2. فقط در صورت موفقیت‌آمیز بودن پرداخت:
        // - اضافه کردن به لیست سفارشات
        setOrders([...orders, newOrder]);
        // - خالی کردن سبد خرید
        setAddProduct([]);
        setAddToCard(0);

        setIsProcessing(false);
        setPaymentSuccess(true);
        
        // 4. هدایت به صفحه تأیید سفارش
        router.push({
          pathname: '/orderSuccess',
          query: { orderId: newOrder.id }
        });
      } catch (error) {
        setIsProcessing(false);
        setGeneralError('Unexpected error occurred. Please try again.');
      }
    }, 2000);
  };
   // Add a return to cart button
   const handleBackToCart = () => {
    router.push('/basket');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    }
    return value;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  if (paymentSuccess) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successIcon}>✓</div>
        <h2>Payment Successful</h2>
        <p>Thank you for your purchase!</p>
        <button 
          className={styles.continueButton}
          onClick={() => setPaymentSuccess(false)}
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button 
        onClick={handleBackToCart}
        className={styles.backButton}
      >
        ← Back to Cart
      </button>

      <h1 className={styles.title}>Payment Details</h1>
      <form onSubmit={handleSubmit} className={styles.paymentForm}>
        {generalError && (
          <div className={styles.error} style={{ marginBottom: 10 }}>{generalError}</div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            required
          />
          {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="John Doe"
            required
          />
          {errors.cardName && <span className={styles.error}>{errors.cardName}</span>}
        </div>
        
        <div className={styles.row}>
          <div className={`${styles.formGroup} ${styles.expiryGroup}`}>
            <label htmlFor="expiry">Expiry Date</label>
            <input
              type="text"
              id="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength="5"
              required
            />
            {errors.expiry && <span className={styles.error}>{errors.expiry}</span>}
          </div>
          
          <div className={`${styles.formGroup} ${styles.cvvGroup}`}>
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
            {errors.cvv && <span className={styles.error}>{errors.cvv}</span>}
          </div>
        </div>
        
        <button 
          type="submit" 
          className={styles.payButton}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      
      <div className={styles.cardIcons}>
        <span className={styles.visaIcon}></span>
        <span className={styles.mastercardIcon}></span>
        <span className={styles.amexIcon}></span>
      </div>
    </div>
  );
};

export default PaymentPage;