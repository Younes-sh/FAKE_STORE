import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Style from './style.module.css';
import Head from 'next/head';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        const data = await res.json();
        setCartData(data.cart);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading cart:", err);
        setLoading(false);
      }
    };

    fetchCart();
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
      const items = cartData.products.map(item => ({
        product: item._id,
        name: item.productName,
        quantity: item.count,
        priceAtPurchase: item.price,
        image: item.image
      }));

      const subtotal = cartData.products.reduce((sum, item) => sum + item.totalPrice, 0);
      const shippingFee = 5;
      const taxAmount = subtotal * 0.1;
      const totalAmount = subtotal + shippingFee + taxAmount;

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
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
      router.push(`/orderSuccess?orderId=${data.order._id}`);
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong while placing order');
    }
  };

  if (loading) {
    return (
      <div className={Style.loading}>
        <div className={Style.spinner}></div>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <div className={Style.checkoutContainer}>
        <div className={Style.header}>
          <h1>Complete the purchase process</h1>
        </div>

        <div className={Style.orderSummary}>
          <h2>Order Summary</h2>
          {cartData.products.map(item => (
            <div key={item._id} className={Style.orderItem}>
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
            <h3>Total amount: {
              cartData.products.reduce((sum, item) => sum + item.totalPrice, 0)
            }</h3>
          </div>
        </div>

        <div className={Style.paymentSection}>
          <h3>Shipping Information</h3>
          <div className={Style.addressForm}>
            <input name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} placeholder="Full Name" required />
            <textarea name="address" value={shippingAddress.address} onChange={handleInputChange} placeholder="Address" rows="2" required />
            <input name="city" value={shippingAddress.city} onChange={handleInputChange} placeholder="City" required />
            <input name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} placeholder="Postal Code" />
            <input name="phone" value={shippingAddress.phone} onChange={handleInputChange} placeholder="Phone Number" required />
          </div>

          <h2>Payment Method</h2>
          <div>
            <label>
              <input type="radio" name="payment" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
              Online Payment
            </label>
            <label>
              <input type="radio" name="payment" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
              Cash on Delivery
            </label>
          </div>

          <button className={Style.payButton} onClick={handlePayment}>Complete Payment</button>
        </div>
      </div>
    </>
  );
}
