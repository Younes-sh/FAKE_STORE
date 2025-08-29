import Style from './basket.module.css';
import { useEffect, useState } from 'react';
import BasketCard from '@/Components/Cards/BasketCard/BasketCard';
import Link from 'next/link';
import emptyCard from '../../../public/asset/Basket/empty-card.jpg';
import Image from 'next/image';
import Footer from '@/Components/Footer';

export default function BasketPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const refreshCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/cart`);
      if (!res.ok) throw new Error("مشکلی در دریافت سبد خرید پیش آمد");

      const data = await res.json();
      setCartItems(data.cart?.products || []);
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      setErrorMsg("خطا در دریافت اطلاعات سبد خرید");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const totalPay = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  return (
    <div>
      <div className="container main">
        <div className={Style.Subtotal}>
          <h3>Subtotal</h3>
          <p>Total pay: ${totalPay}</p>
          <div className={Style.checkoutBtn}>
            <Link href={'/PaymentPage'}>purchase to checkout</Link>
          </div>
        </div>

        {errorMsg && <p className={Style.error}>{errorMsg}</p>}

        <div className={Style.basket}>
          {loading ? (
            <p>Loading...</p>
          ) : cartItems.length > 0 ? (
            cartItems.map(item => (
              <BasketCard
                key={item._id}
                {...item}
                refreshCart={refreshCart}
              />
            ))
          ) : (
            <div>
              <Image
                src={emptyCard}
                width={400}
                height={400}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="Empty Cart"
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
