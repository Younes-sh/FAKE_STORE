import Style from './BasketCard.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { AppContext } from "@/Components/AppContextProvider";
import { useContext } from 'react';
import Head from "next/head";
import Script from 'next/script';
import { useRouter } from 'next/router';

export default function BasketCard({
  _id, productName, price, image, count, totalPrice
}) {
  const { setAddProduct, setAddToCard, addProduct } = useContext(AppContext);
  const router = useRouter();

  // تابع کمکی برای گرفتن سبد خرید جدید از سرور و بروزرسانی context
  const refreshCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
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
  };

  // افزایش تعداد محصول
  const increaseItem = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: _id, quantity: count + 1 }),
      });
      if (response.ok) await refreshCart();
    } catch (error) {
      console.error("خطا در افزایش محصول:", error);
    }
  };

  // کاهش تعداد محصول
  const deacreseItem = async () => {
    try {
      if (count === 1) {
        await deleteItem();
        return;
      }
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: _id, quantity: count - 1 }),
      });
      if (response.ok) await refreshCart();
    } catch (error) {
      console.error("خطا در کاهش محصول:", error);
    }
  };

  // حذف محصول از سبد خرید
  const deleteItem = async () => {
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: _id }),
      });
      if (response.ok) await refreshCart();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  // کپی لینک محصول
  const handleShareClick = async () => {
    const productLink = `${window.location.origin}/products/${_id}`;
    try {
      await navigator.clipboard.writeText(productLink);
      // alert('لینک محصول کپی شد!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('متاسفانه در کپی کردن لینک مشکلی پیش آمد.');
    }
  };

  // خرید مستقیم
  const checkoutHandler = () => {
    if (addProduct.length === 0) {
      alert('سبد خرید شما خالی است');
      return;
    }
    const order = {
      items: addProduct.map(product => ({
        _id: product._id,
        productName: product.productName,
        price: product.price,
        count: product.count,
        totalPrice: product.totalPrice,
        image: product.image
      })),
      totalAmount: addProduct.reduce((sum, product) => sum + product.totalPrice, 0)
    };
    localStorage.setItem('tempOrder', JSON.stringify(order));
    router.push('/checkout');
  };

  const continueShopping = () => {
    router.push('/products');
  };

  return (
    <div className={Style.basketCard}>
      <Head>
        <title>Fake Store</title>
        <meta name="description" content="Store gold silver watch" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Script fontawsome */}
      <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossOrigin="anonymous"></Script>

      <Link href={`/products/${_id}`}>
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
                    <i data-fa-symbol="delete" color='red' className="fa-solid fa-trash fa-fw"></i>
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