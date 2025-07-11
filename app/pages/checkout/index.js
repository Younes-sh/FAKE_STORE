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

  const handlePayment = async () => {
  if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.phone) {
    alert('Please complete all required shipping information');
    return;
  }

  try {
    const subtotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingFee = 5;
    const taxAmount = subtotal * 0.1;
    const totalAmount = subtotal + shippingFee + taxAmount;

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: order.items,
        subtotal,
        shippingFee,
        taxAmount,
        totalAmount,
        paymentMethod: paymentMethod === 'cash' ? 'cash_on_delivery' : 'credit_card',
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: '',
          postalCode: shippingAddress.postalCode,
          country: 'IR'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Order failed: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    console.log("Redirecting with orderId:", data.order._id);
    localStorage.removeItem('tempOrder');
    router.push(`/orderSuccess?orderId=${data.order._id}`);
  } catch (error) {
    console.error('Order error:', error);
    alert('Something went wrong while placing order');
  }
};



  if (loading) return (
    <div className={Style.loading}>
      <div className={Style.spinner}></div>
      <p>Loading payment information...</p>
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
                  aria-label="Remove product"
                >
                  ×
                </button>
              <Image src={item.image} alt={item.productName} width={500} height={500} />
              <div className={Style.orderItemDetails}>
                <h4>{item.productName}</h4>
                <p>Quantity: {item.count}</p>
                <p>Unit price: {item.price}</p>
                <p>Total: {item.totalPrice}</p>
              </div>
            </div>
          ))}
          
          <div className={Style.orderTotal}>
            <h3>Total amount: {order.totalAmount}</h3>
          </div>
        </div>

        <div className={Style.paymentSection}>
          <div className={Style.shippingAddress}>
            <h3>Shipping Information</h3>
            <div className={Style.addressForm}>
              <div className={Style.formGroup}>
                <label htmlFor="fullName">Full name</label>
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
                <label htmlFor="address">Complete address</label>
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
                <label htmlFor="phone">Phone number</label>
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
          
          <h2>Payment Method</h2>
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
              Cash on delivery
            </label>
          </div>

          <button 
            className={Style.payButton}
            onClick={handlePayment}
          >
            Complete Payment
          </button>
        </div>
      </div>
    </>
  );
}