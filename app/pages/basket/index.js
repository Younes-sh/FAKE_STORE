// pages/basket.js
import Style from './basket.module.css';
import { useState, useEffect } from 'react';
import BasketCard from '@/Components/Cards/BasketCard/BasketCard';
import Link from 'next/link';
import Footer from '@/Components/Footer';
import { useSession } from 'next-auth/react';

export default function BasketPage() {
  const { data: session } = useSession();
  const [cart, setCart] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch cart data
  const fetchCart = async () => {
    if (!session?.user?.id) {
      setCart({ products: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }
      const data = await res.json();
      console.log('🛒 Cart data received:', data.cart);
      setCart(data.cart || { products: [] });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setErrorMsg('Error retrieving shopping cart information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();

    // Listen for cart update events
    const handleCartUpdate = () => {
      console.log('🛒 Cart update event received in BasketPage');
      fetchCart();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [session?.user?.id]);

  const totalPay = cart.products?.reduce((sum, item) => sum + (item.totalPrice || 0), 0) || 0;

  return (
    <div>
      <div className="container main">
        <div className={Style.Subtotal}>
          <h3>Subtotal</h3>
          <p>Total: ${totalPay.toFixed(2)}</p>
          {cart.products?.length > 0 && (
            <div className={Style.checkoutBtn}>
              <Link href={'/PaymentPage'}>Proceed to Checkout</Link>
            </div>
          )}
        </div>

        {errorMsg && <p className={Style.error}>{errorMsg}</p>}

        <div className={Style.basket}>
          {isLoading ? (
            <div className={Style.loadingContainer}>
              <p>Loading your cart...</p>
            </div>
          ) : cart.products?.length > 0 ? (
            cart.products.map(item => (
              <BasketCard
                key={item._id}
                {...item}
                onUpdate={fetchCart}
              />
            ))
          ) : (
            <div className={Style.emptyCart}>
              <h2>Your cart is empty</h2>
              <p>You have no items in your shopping cart. To add items, click "Add to cart" next to the product.</p>
              <Link href="/products" className={Style.continueShopping}>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}