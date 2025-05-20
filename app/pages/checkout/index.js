import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Style from './style.module.css';
import Head from 'next/head';
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [removingItem, setRemovingItem] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    const savedOrder = localStorage.getItem('tempOrder');
    if (!savedOrder) {
      router.push('/');
      return;
    }

    setOrder(JSON.parse(savedOrder));
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = () => {
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.phone) {
      alert('لطفا اطلاعات آدرس را کامل کنید');
      return;
    }

    // اینجا می‌توانید منطق پرداخت واقعی را پیاده‌سازی کنید
    alert(`پرداخت ${order.totalAmount} با روش ${paymentMethod === 'online' ? 'آنلاین' : 'در محل'} با موفقیت انجام شد`);
    localStorage.removeItem('tempOrder');
    router.push('/order-success');
  };

  if (loading) return (
    <div className={Style.loading}>
      <div className={Style.spinner}></div>
      <p>در حال بارگذاری اطلاعات پرداخت...</p>
    </div>
  );

   

  const removeItem = (itemId) => {
    const updatedItems = order.items.filter(item => item._id !== itemId);
    
    // if (updatedItems.length === 0) {
    //   router.push('/cart');
    //   return;
    // }

    const updatedOrder = {
      ...order,
      items: updatedItems,
      totalAmount: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
    };

    setOrder(updatedOrder);
    localStorage.setItem('tempOrder', JSON.stringify(updatedOrder));
    setRemovingItem(itemId);
    setTimeout(() => setRemovingItem(null), 500);
  };


  return (
    <>
      <Head>
        <title>Complete the purchase process</title>
      </Head>
      
      <div className={Style.checkoutContainer}>
        <div className={Style.header}>
          <h1>Complete the purchase process</h1>
          <p>Please check payment and shipping information.</p>
        </div>
        
        <div className={Style.orderSummary}>
          <h2>Order Summary</h2>
          {order.items.map(item => (
            <div key={item._id} className={Style.orderItem}>
                <button 
                  className={Style.removeItemBtn}
                  onClick={() => removeItem(item._id)}
                  aria-label="حذف محصول"
                >
                  ×
                </button>
              <Image src={item.image} alt={item.productName} width={500}
      height={500} />
              <div className={Style.orderItemDetails}>
                <h4>{item.productName}</h4>
                <p>Number: {item.count}</p>
                <p> Unit price: {item.price}</p>
                <p>Total: {item.totalPrice}</p>
              </div>
            </div>
          ))}
          
          <div className={Style.orderTotal}>
            <h3>Amount payable: {order.totalAmount}</h3>
          </div>
        </div>

        <div className={Style.paymentSection}>
          <div className={Style.shippingAddress}>
            <h3>Shipping information</h3>
            <div className={Style.addressForm}>
              <div className={Style.formGroup}>
                <label htmlFor="fullName"> Full name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={Style.formGroup}>
                <label htmlFor="address">Full address</label>
                <textarea 
                  id="address" 
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  required
                  rows="3"
                />
              </div>
              
              <div className={Style.formGroup}>
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={Style.formGroup}>
                <label htmlFor="postalCode">Postal code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={Style.formGroup}>
                <label htmlFor="phone">Mobile phone</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <h2>Payment method</h2>
          <div className={Style.paymentMethods}>
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="online"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
              />
               Online payment
            </label>
            <label>
              <input 
                type="radio" 
                name="payment" 
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
               Payment on site 
            </label>
          </div>

          <button 
            className={Style.payButton}
            onClick={handlePayment}
          >
            Final payment 
          </button>
        </div>
      </div>
    </>
  );
}