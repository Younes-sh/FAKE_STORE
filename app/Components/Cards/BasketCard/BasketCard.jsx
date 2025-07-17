// Components/Cards/BasketCard/BasketCard.js
import Style from './BasketCard.module.css';
import Image from 'next/image';
import Link from 'next/link';
import Head from "next/head";
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useContext } from "react";
import { AppContext } from "@/pages/_app";

export default function BasketCard({ _id, productName, price, image, count, totalPrice , refreshCart }) {
  const router = useRouter();
  const { setAddProduct, setAddToCard } = useContext(AppContext);


  const increaseItem = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{
            _id,
            productName,
            price,
            count: count + 1,
            totalPrice: (count + 1) * price,
            image
          }]
        }),
      });
      if (response.ok) await refreshCart();
    } catch (error) {
      console.error("خطا در افزایش محصول:", error);
    }
   
  };

  const deacreseItem = async () => {
  try {
    if (count <= 1) {
      await deleteItem();
      return;
    }
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [{
            _id,
            productName,
            price,
            count: count - 1,
            totalPrice: (count - 1) * price,
            image
          }]
      }),
    });
    if (response.ok) await refreshCart();
  } catch (error) {
    console.error("خطا در کاهش محصول:", error);
  }
};


  const deleteItem = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: _id }),
      });
      if (response.ok) await refreshCart();

      // بعد از افزودن به سبد خرید، مقدار سبد را بروز کن
      const res = await fetch('/api/cart');
      const updated = await res.json();
      const items = updated.cart?.products || [];

      setAddProduct(items);
      // setAddToCard(items.reduce((sum, item) => sum + item.count, 0));
      setAddToCard(updated.cart?.products?.length || 0);
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const handleShareClick = async () => {
    const productLink = `${window.location.origin}/products/${_id}`;
    try {
      await navigator.clipboard.writeText(productLink);
      alert('لینک محصول کپی شد!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const checkoutHandler = () => {
  const order = {
    items: [{
      product: _id,
      name: productName,
      quantity: count,
      priceAtPurchase: price,
      image
    }]
  };
  router.push('/checkout');
};

  return (
    <div className={Style.basketCard}>
      <Head>
        <title>Fake Store</title>
        <meta name="description" content="Store gold silver watch" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossOrigin="anonymous" />

      <Link  href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image src={image} alt={productName} width={100} height={100} className={Style.image} />
        </div>
      </Link>

      <div className={Style.info}>
        <p>Name: {productName}</p>
        <p>Price: {price}</p>
        <p>Total price: {totalPrice}</p>
      </div>

      <div className={Style.controlItem}>
        <div className={Style.quantity}>
          <div className={Style.counter}>
            {
              count > 1
                ? <button className={Style.deacreseBtn} onClick={deacreseItem}>-</button>
                : <button className={Style.btnRemove} onClick={deleteItem}>
                    <i className="fa-solid fa-trash fa-fw"></i>
                  </button>
            }
            <p><b>{count}</b></p>
            <button className={Style.increaseBtn} onClick={increaseItem}>+</button>
          </div>
          <div className={Style.Btn}>
            <button className={Style.btnBuy} onClick={checkoutHandler}>Buy</button>
          </div>
        </div>
        <div>
          <button className={Style.btnRemove} onClick={deleteItem}>Delete</button>
          <button className={Style.btnRemove}>Save</button>
          <button className={Style.btnRemove} onClick={handleShareClick}>Share</button>
        </div>
      </div>
    </div>
  );
}
