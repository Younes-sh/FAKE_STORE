import Style from './basket.module.css';
import { useContext, useMemo, useState, useEffect } from 'react';
import {AppContext} from "@/Components/AppContextProvider";
import BasketCard from '../../Components/Cards/BasketCard/BasketCard';
import Link from 'next/link';
import emptyCard from '@/public/asset/Basket/emptyCard.jpg';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function BasketPage() {
  const { setAddProduct, setAddToCard, addProduct } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  // ...existing code...
useEffect(() => {
  const fetchCart = async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      const data = await res.json();
      // تبدیل داده‌های دریافتی به فرمت مورد نیاز
      const items = (data.cart?.items || []).map(item => ({
        _id: item.productId._id,
        productName: item.productId.productName,
        price: item.productId.price,
        count: item.quantity,
        totalPrice: item.quantity * item.productId.price,
        image: item.productId.image
      }));
      setAddProduct(items);
      setAddToCard(items.reduce((sum, item) => sum + item.count, 0));
    } catch (err) {
      setAddProduct([]);
      setAddToCard(0);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'authenticated') {
    fetchCart();
  } else if (status === 'unauthenticated') {
    setAddProduct([]);
    setAddToCard(0);
    setLoading(false);
  }
}, [status, setAddProduct, setAddToCard]);
// ...existing code...
  const totalPaye = useMemo(() => {
    return addProduct.reduce((sum, item) => {
      const price = typeof item.totalPrice === 'number' ? item.totalPrice : 0;
      return sum + price;
    }, 0);
  }, [addProduct]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="container main">
        <div className={Style.Subtotal}>
          <h3>Subtotal</h3>
          <p>Total pay: $ {totalPaye}</p>
          <div className={Style.checkoutBtn}>
            <Link href={'/PaymentPage'}>purchase to checkout</Link>
          </div>
        </div>

        <div className={Style.basket}>
          {addProduct.length > 0 ? (
            <div>
              {addProduct.map(item => (
                <BasketCard key={item._id} {...item} />
              ))}
            </div>
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
    </div>
  );
}
