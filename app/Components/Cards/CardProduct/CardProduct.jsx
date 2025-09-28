// Components/Cards/CardProduct/CardProduct.jsx
import Style from "./style.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/Components/AlertModal/AlertModal";
import { useCart } from "@/contexts/CartContext";

export default function ProductCard({
  _id,
  productName,
  description,
  price,
  image,
  model,
  section,
}) {
  const router = useRouter();
  const { data: session } = useSession();

  const [adding, setAdding] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [imageError, setImageError] = useState(false);

  // استفاده از CartContext - 🔥 اصلاح: استفاده از cart به جای cartItems
  const { cart, addToCart } = useCart();

  // 🔥 اصلاح: بررسی اینکه محصول در سبد هست یا نه
  const isInCart = Array.isArray(cart?.products) && 
                  cart.products.some((item) => item._id === _id);

  const handleAddToCart = async () => {
    if (!session) {
      setShowLoginAlert(true);
      return;
    }

    setAdding(true);
    try {
      const productData = {
        productId: _id,
        quantity: 1
      };

      console.log('🛒 Sending product to cart:', productData);

      const success = await addToCart(productData);

      if (success) {
        console.log('✅ Product added to cart successfully');
      } else {
        alert("❌ Failed to add product to basket");
      }
    } catch (error) {
      console.error("❌ Error adding to basket:", error);
      alert("Error adding to cart: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleImageError = () => setImageError(true);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);

  return (
    <div className={Style.productCard}>
      {/* مودال هشدار لاگین */}
      <AlertModal
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        title="Login Required"
        message="Please log in first to add product to basket."
        confirmText="Login"
        cancelText="Close"
        type="warning"
        onConfirm={() => router.push("/login")}
      />

      {/* تصویر و لینک محصول */}
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image
            src={imageError ? "/images/placeholder-product.jpg" : image}
            alt={productName || "Product"}
            width={300}
            height={200}
            style={{ objectFit: "cover" }}
            onError={handleImageError}
            onLoad={() => setImageError(false)}
          />
        </div>
      </Link>

      {/* متن و دکمه‌ها */}
      <div className={Style.TextContainer}>
        <h4>{productName || "Unknown Product"}</h4>
        <p>Price: {formatPrice(price)}</p>

        {/* 🔥 این بخش حالا باید درست کار کند */}
        {isInCart && (
          <div className={Style.inCartIndicator}>
            ✓ This product is in your Basket 🛒
          </div>
        )}

        <div className={Style.buttonContainer}>
          <button
            className={`${Style.baseBtn} ${
              isInCart ? Style.btnAddAgain : Style.btnAddToCard
            }`}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding
              ? "Processing..."
              : isInCart
              ? "Add More"
              : "Add to Basket"}
          </button>
        </div>
      </div>
    </div>
  );
}