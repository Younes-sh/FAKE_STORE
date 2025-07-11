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
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          products: [{
            _id,
            productName,
            price: Number(price),
            count: 1,
            totalPrice: Number(price),
            image,
            createdAt: new Date(),
            updatedAt: new Date(),
            description,
            section,
            model
          }]
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Add to cart failed');

      // بعد از افزودن به سبد خرید، مقدار سبد را بروز کن
      const res = await fetch('/api/cart');
      const updated = await res.json();
      const items = updated.cart?.products || [];

      setAddProduct(items);
      setAddToCard(items.reduce((sum, item) => sum + item.count, 0));

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
      alert("خطا در افزودن به سبد خرید");
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
