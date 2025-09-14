import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({
  _id, productName, description, price, image, model, section
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [adding, setAdding] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { isProductInCart, addToCart, fetchCart } = useCart();

  // بررسی وضعیت محصول در سبد خرید
  useEffect(() => {
    if (_id) {
      setIsInCart(isProductInCart(_id));
    }
  }, [_id, isProductInCart]);

  const handleAddToCart = async () => {
    if (!session) {
      setShowLoginAlert(true);
      return;
    }
    
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
      
      // console.log('🛒 Adding product to basket:', product);
      
      const success = await addToCart(product);
      
      if (success) {
        console.log('✅ Product added/updated successfully');
        setIsInCart(true);
        await fetchCart();
      } else {
        alert('Failed to add product to basket');
      }
      
    } catch (error) {
      console.error('❌ Error adding to basket:', error);
      alert('Error adding to cart: ' + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price || 0);
  };

  return (
    <div className={Style.productCard}>
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="Login Required"
        message="Please log in first to add product to basket."
        confirmText="Login"
        cancelText="Close"
        type="warning"
        onConfirm={() => router.push('/login')}
      />
      
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image 
            src={imageError ? '/images/placeholder-product.jpg' : image} 
            alt={productName || 'Product'} 
            width={300} 
            height={200} 
            style={{ objectFit: 'cover' }}
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        </div>
      </Link>
      
      <div className={Style.TextContainer}>
        <h4>{productName || 'Unknown Product'}</h4>
        <p>Price: {formatPrice(price)}</p>
        
        {isInCart && (
          <div className={Style.inCartIndicator}>
            ✓ This product is in your Basket 🛒
          </div>
        )}
        
        <div className={Style.buttonContainer}>
          <button
            className={`${Style.baseBtn} ${isInCart ? Style.btnAddAgain : Style.btnAddToCard}`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Processing...' : isInCart ? 'Add More' : 'Add to Basket'}
          </button>
        </div>
      </div>
    </div>
  );
}