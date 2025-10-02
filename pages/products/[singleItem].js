import { useState, useEffect, useContext } from "react";
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
          {/* جایگزینی Image با img ساده */}
          <img
            src={dataProduct.image}
            alt={dataProduct.section}
            className={Style.productImage}
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
              <b>Description</b> {dataProduct.description}
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
                <img
                  src={dataProduct.image}
                  alt={dataProduct.section}
                  style={{
                    position: "absolute",
                    left: -mousePosition.x,
                    top: -mousePosition.y,
                    transform: "scale(1.5)",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
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
        <Link href={'/products'} className={Style.btnBack}>Back to Products</Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    const { req, params } = context;
    const { singleItem } = params;
    
    // Get the correct base URL for both production and development
    let baseUrl;
    
    if (process.env.NODE_ENV === 'production') {
      // Use the request headers to get the correct host
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      baseUrl = `${protocol}://${host}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    console.log('Fetching from:', `${baseUrl}/api/products/${singleItem}`);
    
    const res = await fetch(`${baseUrl}/api/products/${singleItem}`);
    
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    
    // Handle case where product is not found
    if (!data || !data.data) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: { 
        dataProduct: data.data 
      },
    };
    
  } catch (error) {
    console.error('Error fetching product:', error);
    
    // Return 404 page if product not found
    return {
      notFound: true,
    };
  }
}