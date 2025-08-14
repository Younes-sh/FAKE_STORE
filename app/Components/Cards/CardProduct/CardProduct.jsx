// Components/CardProduct.js
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/pages/_app";

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);

  // آیا این محصول در سبد خرید هست؟
  const [isInCart, setIsInCart] = useState(false);
  const [adding, setAdding] = useState(false); // برای جلوگیری از دابل کلیک/نمایش لودینگ

  // یک‌بار روی mount چک می‌کنیم آیا این محصول در سبد هست
  useEffect(() => {
    let ignore = false;

    const checkInCart = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) return; // اگر لاگین نیست یا اروری بود، بی‌خیال
        const data = await res.json();
        const exists = (data.cart?.products || []).some(p => p._id === _id);
        if (!ignore) setIsInCart(exists);
      } catch (e) {
        // بی‌سر و صدا
      }
    };

    checkInCart();
    return () => { ignore = true; };
  }, [_id]);

  const addProductBtn = async () => {
    if (adding) return;
    setAdding(true);

    try {
      // اول ببین الان چند تا از همین محصول توی سبد هست
      const res = await fetch('/api/cart');
      const cartData = await res.json();
      const current = cartData.cart?.products?.find(p => p._id === _id);

      const nextCount = current ? current.count + 1 : 1;

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{
            _id,
            productName,
            price,
            count: nextCount,
            totalPrice: price * nextCount,
            image,
            description,
            model,
            section
          }]
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'خطا در افزودن به سبد خرید');
      }

      // اگر برای اولین بار اضافه شد، شمارنده‌ی Navbar رو یک واحد زیاد کن
      if (!current) {
        setAddToCard(prev => prev + 1);
      }

      // از این به بعد دکمه باید “Add again” شود
      setIsInCart(true);

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
      // می‌تونی toast/alert بزنی
    } finally {
      setAdding(false);
    }
  };

  // const buyNowHandler = () => {
  //   router.push(`/checkout?productId=${_id}`);
  // };

  return (
    <div className={Style.productCard}>
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image
            src={image}
            alt={productName}
            width={16}
            height={9}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      </Link>

      <div className={Style.TextContainer}>
        <h4>{productName}</h4>
        <p>Price: {price}</p>

        {/* نشان “داخل سبد” (دلخواه) */}
        {isInCart && (
          <div style={{ fontSize: 12, marginBottom: 6, color: '#16a34a' }}>
            ✓ This item is in your cart
          </div>
        )}

        <div className={Style.buttonContainer}>
          <button
            className={Style.btnAddToCard}
            onClick={addProductBtn}
            disabled={adding}
          >
            {adding ? 'Adding…' : (isInCart ? 'Add again' : 'Add to Cart')}
          </button>

          {/* <button className={Style.btnBuy} onClick={buyNowHandler}>
            Buy Now
          </button> */}
        </div>
      </div>
    </div>
  );
}
