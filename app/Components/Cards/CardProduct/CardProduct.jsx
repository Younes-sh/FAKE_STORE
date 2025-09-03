// Components/Cards/CardProduct/CardProduct.js
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import { useCart } from '@/hooks/useCart';

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, addToCart, isConnected } = useCart();

  const [adding, setAdding] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const isInCart = cart.some(item => item._id === _id);

  const handleAddToCart = async () => {
    if (!session) {
      setShowLoginAlert(true);
      return;
    }

    if (adding) return;
    setAdding(true);

    try {
      const product = {
        _id,
        productName,
        price,
        image,
        description,
        model,
        section
      };

      const success = await addToCart(product);
      
      if (!success) {
        throw new Error('خطا در افزودن به سبد خرید');
      }

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={Style.productCard}>
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="ورود لازم است"
        message="برای افزودن محصول به سبد خرید، لطفاً ابتدا وارد شوید."
        confirmText="ورود"
        cancelText="بستن"
        type="warning"
        onConfirm={() => router.push('/login')}
      />

      {!isConnected && (
        <div style={{ 
          fontSize: 10, 
          color: 'orange', 
          padding: '2px 5px',
          background: '#fff3cd',
          borderRadius: '3px',
          marginBottom: '5px'
        }}>
          🔄 در حال اتصال...
        </div>
      )}

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
        <p>قیمت: {price}</p>

        {isInCart && (
          <div style={{ fontSize: 12, marginBottom: 6, color: '#16a34a' }}>
            ✓ این محصول در سبد خرید شما است
          </div>
        )}

        <div className={Style.buttonContainer}>
          <button
            className={Style.btnAddToCard}
            onClick={handleAddToCart}
            disabled={adding || !isConnected}
          >
            {adding ? 'در حال افزودن…' : 
             !isConnected ? 'اتصال…' :
             isInCart ? 'افزودن مجدد' : 'افزودن به سبد خرید'}
          </button>
        </div>
      </div>
    </div>
  );
}