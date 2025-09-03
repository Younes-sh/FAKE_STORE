// Components/Cards/CardProduct/CardProduct.js
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from "react";
import { AppContext } from "@/pages/_app";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/Components/AlertModal/AlertModal";

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);
  const { data: session } = useSession();

  const [isInCart, setIsInCart] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // تابع برای گرفتن baseUrl به صورت ایمن
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      // در سمت کلاینت
      return window.location.origin;
    }
    // در سمت سرور - استفاده از environment variableهای Vercel
    return process.env.NODE_ENV === 'production' 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
  };

  useEffect(() => {
    let ignore = false;

    const checkInCart = async () => {
      if (!session) return;
      
      try {
        const baseUrl = getBaseUrl();
        const res = await fetch(`${baseUrl}/api/cart`, {
          credentials: 'include' // برای ارسال کوکی‌ها
        });
        
        if (!res.ok) return;
        const data = await res.json();
        const exists = Array.isArray(data.cart?.products) && 
                       data.cart.products.some(p => p && p._id === _id);
        if (!ignore) setIsInCart(exists);
      } catch (e) {
        console.error("Error checking cart:", e);
      }
    };

    checkInCart();
    return () => { ignore = true; };
  }, [_id, session]);

  const addProductBtn = async () => {
    if (!session) {
      setShowLoginAlert(true);
      return;
    }

    if (adding) return;
    setAdding(true);

    try {
      const baseUrl = getBaseUrl();
      
      // ابتدا سبد خرید فعلی را بگیرید
      const cartRes = await fetch(`${baseUrl}/api/cart`, {
        credentials: 'include'
      });
      const cartData = await cartRes.json();
      const currentProducts = Array.isArray(cartData.cart?.products) ? cartData.cart.products : [];
      
      // بررسی آیا محصول قبلاً وجود دارد
      const existingProductIndex = currentProducts.findIndex(p => p && p._id === _id);
      let updatedProducts = [...currentProducts];

      if (existingProductIndex > -1) {
        // افزایش تعداد اگر وجود دارد
        updatedProducts[existingProductIndex].count += 1;
        updatedProducts[existingProductIndex].totalPrice = 
          updatedProducts[existingProductIndex].price * updatedProducts[existingProductIndex].count;
      } else {
        // اضافه کردن محصول جدید
        updatedProducts.push({
          _id,
          productName,
          price,
          count: 1,
          totalPrice: price,
          image,
          description,
          model,
          section
        });
      }

      // به روز رسانی سبد خرید
      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ products: updatedProducts })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Error adding to cart');
      }

      // به روز رسانی state
      setAddToCard(prev => prev + 1);
      setIsInCart(true);

      // برای اطمینان، دوباره وضعیت سبد خرید را چک کنید
      const verifyRes = await fetch(`${baseUrl}/api/cart`, {
        credentials: 'include'
      });
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        const exists = Array.isArray(verifyData.cart?.products) && 
                       verifyData.cart.products.some(p => p && p._id === _id);
        setIsInCart(exists);
      }

    } catch (error) {
      console.error("❌ Error adding to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={Style.productCard}>
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="Login required"
        message="To add a product to your cart, please log in first."
        confirmText="Log in"
        cancelText="Close"
        type="warning"
        onConfirm={() => router.push('/login')}
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
          <div style={{ fontSize: 12, marginBottom: 6, color: '#16a34a', paddingTop: 4 }}>
            ✓ This product is in your cart          
          </div>
        )}

        <div className={Style.buttonContainer}>
          <button
            className={Style.btnAddToCard}
            onClick={addProductBtn}
            disabled={adding}
          >
            {adding ? 'Adding…' : (isInCart ? 'Re-add' : 'Add to cart')}
          </button>
        </div>
      </div>
    </div>
  );
}