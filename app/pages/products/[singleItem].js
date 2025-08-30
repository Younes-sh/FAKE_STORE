import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Style from "./singleItem.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { AppContext } from "@/pages/_app";

export default function SingleItem({ dataProduct }) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);
  const [showMaxiImage, setShowMaxiImage] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // آیا این محصول در سبد خرید هست؟
  const [isInCart, setIsInCart] = useState(false);
  const [adding, setAdding] = useState(false); // برای جلوگیری از دابل کلیک/نمایش لودینگ

    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  // یک‌بار روی mount چک می‌کنیم آیا این محصول در سبد هست
  useEffect(() => {
    let ignore = false;

    const checkInCart = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/cart`);
        if (!res.ok) return; // اگر لاگین نیست یا اروری بود، بی‌خیال
        const data = await res.json();
        const exists = (data.cart?.products || []).some(p => p._id === dataProduct._id);
        if (!ignore) setIsInCart(exists);
      } catch (e) {
        // بی‌سر و صدا
      }
    };

    checkInCart();
    return () => { ignore = true; };
  }, [dataProduct._id]);

  const addProductBtn = async () => {
    if (adding) return;
    setAdding(true);

    try {
      // اول ببین الان چند تا از همین محصول توی سبد هست
      const res = await fetch(`${baseUrl}/api/cart`);
      const cartData = await res.json();
      const current = cartData.cart?.products?.find(p => p._id === dataProduct._id);

      const nextCount = current ? current.count + 1 : 1;

      const response = await fetch(`${baseUrl}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [{
            _id: dataProduct._id,
            productName: dataProduct.productName,
            price: dataProduct.price,
            count: nextCount,
            totalPrice: dataProduct.price * nextCount,
            image: dataProduct.image,
            description: dataProduct.description,
            model: dataProduct.model,
            section: dataProduct.section
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

      // از این به بعد دکمه باید "Add again" شود
      setIsInCart(true);

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
      // می‌تونی toast/alert بزنی
    } finally {
      setAdding(false);
    }
  };

  // const buyNowHandler = () => {
  //   router.push(`/checkout?productId=${dataProduct._id}`);
  // };

  return (
    <div className='container main'>
      <div className={Style.singleItem}>
        <div
          className={Style.image}
          onMouseEnter={() => setShowMaxiImage(true)}
          onMouseLeave={() => setShowMaxiImage(false)}
          onMouseMove={(e) =>
            setMousePosition({
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            })
          }
        >
          <Image
            src={dataProduct.image}
            alt={dataProduct.section}
            width={16}
            height={9}
            layout="responsive"
          />
        </div>

        <div className={Style.text}>
          <p>
            <b>Name</b> {dataProduct.productName}
          </p>
          <hr />
          <div className={Style.info}>
            <p>
              <b>Price</b> {dataProduct.price} $
            </p>
            <p>
              <b>Model</b> {dataProduct.model}
            </p>
            <p>
              <b></b> {dataProduct.description}
            </p>
          </div>

          {/* نشان "داخل سبد" (دلخواه) */}
          {isInCart && (
            <div style={{ fontSize: 12, marginBottom: 6, color: '#16a34a' }}>
              ✓ This item is in your cart
            </div>
          )}

          {/* Maximize image */}
          {showMaxiImage && (
            <div className={Style.imageMaximize}>
              <div className={Style.imageMaximizeContainer}>
                <Image
                  src={dataProduct.image}
                  alt={dataProduct.section}
                  width={3}
                  height={1}
                  layout="responsive"
                  style={{
                    position: "absolute",
                    left: -mousePosition.x,
                    top: -mousePosition.y,
                    transform: "scale(2)",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={Style.buttonContainer}>
        <button 
          className={`${Style.button} ${Style.btnAddtoCard}`}
          onClick={addProductBtn}
          disabled={adding}
        >
          {adding ? 'Adding…' : (isInCart ? 'Add again' : 'Add to Cart')}
        </button>
        <Link href={'/products'} className={Style.btnBack}>Back to </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { singleItem } = context.params;
  const res = await fetch(`${baseUrl}/api/products/${singleItem}`);
  const data = await res.json();
  return {
    props: { dataProduct: data.data },
  };
}