// Components/CardProduct.js
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext } from "react";
import { AppContext } from "@/pages/_app"; 

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { setAddProduct, setAddToCard } = useContext(AppContext);

  const addProductBtn = async () => {
  try {
    const res = await fetch('/api/cart');
    const cartData = await res.json();
    const existing = cartData.cart?.products?.find(p => p._id === _id);

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [{
          _id,
          productName,
          price,
          count: existing ? existing.count + 1 : 1,
          totalPrice: price * (existing ? existing.count + 1 : 1),
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

    // ✅ فقط اگر محصول جدید بود، عدد سبد خرید را زیاد کن
    if (!existing) {
      setAddToCard(prev => prev + 1);
    }

  } catch (error) {
    console.error("❌ خطا در افزودن به سبد خرید:", error);
  }
};


  const buyNowHandler = () => {
    router.push(`/checkout?productId=${_id}`);
  };

  return (
    <div className={Style.productCard}>
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image src={image} alt={productName} width={16} height={9} layout="responsive" objectFit="cover" />
        </div>
      </Link>
      <div className={Style.TextContainer}>
        <h4>{productName}</h4>
        <p>Price: {price}</p>
        <div className={Style.buttonContainer}>
          <button className={Style.btnAddToCard} onClick={addProductBtn}>
            Add to Cart
          </button>
          <button className={Style.btnBuy} onClick={buyNowHandler}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
