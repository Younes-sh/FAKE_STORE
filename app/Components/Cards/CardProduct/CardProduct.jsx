// Components/CardProduct.js
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/pages/_app";
import { useSession } from "next-auth/react"; // اضافه شد
import { AlertModal } from "@/Components/AlertModal/AlertModal"; // مسیر خودت

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);
  const { data: session } = useSession(); // گرفتن سشن

  const [isInCart, setIsInCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false); // state برای مودال

  useEffect(() => {
    let ignore = false;

    const checkInCart = async () => {
      let isProduction = process.env.NODE_ENV === 'production';
      let baseUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
      try {
        const res = await fetch(`${baseUrl}/api/cart`);
        if (!res.ok) return;
        const data = await res.json();
        const exists = (data.cart?.products || []).some(p => p._id === _id);
        if (!ignore) setIsInCart(exists);
      } catch (e) {}
    };

    checkInCart();
    return () => { ignore = true; };
  }, [_id]);

  const addProductBtn = async () => {
    // اگر لاگین نیست، مودال را باز کن و ادامه نده
    if (!session) {
      setShowLoginAlert(true);
      return;
    }

    if (adding) return;
    setAdding(true);
    let isProduction = process.env.NODE_ENV === 'production';
    let baseUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    try {
      const res = await fetch(`${baseUrl}/api/cart`);
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

      if (!current) {
        setAddToCard(prev => prev + 1);
      }
      setIsInCart(true);

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={Style.productCard}>
      {/* مودال هشدار ورود */}
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="Login required"
        message="To add a product to the cart, please log in first."
        confirmText="Login"
        cancelText="Close"
        type="warning"
        onConfirm={() => router.push('/login')} // مسیر صفحه لاگین
      />

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
        </div>
      </div>
    </div>
  );
}
