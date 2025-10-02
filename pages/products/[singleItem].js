import { useState, useEffect, useContext, useRef } from "react";
import Style from "./singleItem.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { AppContext } from "@/pages/_app";
import { useCart } from '@/contexts/CartContext';

export default function SingleItem({ dataProduct }) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);
  const { addToCart, isProductInCart, loading: cartLoading } = useCart();
  
  const [showMaxiImage, setShowMaxiImage] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false); // وضعیت جدید
  
  const imageMaximizeRef = useRef(null);

  // بررسی اینکه آیا محصول در سبد هست
  const isInCart = dataProduct?._id ? isProductInCart(dataProduct._id) : false;

  // وقتی محصول در سبد قرار می‌گیرد، addedToCart را true کنیم
  useEffect(() => {
    if (isInCart) {
      setAddedToCart(true);
    }
  }, [isInCart]);

  const addProductBtn = async () => {
    if (adding || !dataProduct || addedToCart) return; // غیرفعال اگر قبلاً اضافه شده
    setAdding(true);

    try {
      const productToSend = {
        productId: dataProduct._id,
        productName: dataProduct.productName,
        price: dataProduct.price,
        count: 1,
        image: dataProduct.image,
        description: dataProduct.description,
        model: dataProduct.model,
        section: dataProduct.section
      };

      const success = await addToCart(productToSend);

      if (success && !isInCart) {
        setAddToCard(prev => prev + 1);
        setAddedToCart(true); // بعد از موفقیت، وضعیت را تغییر بده
      }

      if (!success) {
        alert('خطا در افزودن به سبد خرید');
      }

    } catch (error) {
      console.error("❌ خطا در افزودن به سبد خرید:", error);
      alert('خطا در افزودن به سبد خرید');
    } finally {
      setAdding(false);
    }
  };

  const handleMouseMove = (e) => {
    if (!showMaxiImage) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    return () => {
      setShowMaxiImage(false);
    };
  }, []);

  if (!dataProduct) {
    return (
      <div className='container main'>
        <div className={Style.singleItem}>
          <div className={Style.errorState}>
            <h2>محصول یافت نشد</h2>
            <p>محصولی که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
            <Link href={'/products'} className={Style.btnBack}>
              ← بازگشت به محصولات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // تعیین وضعیت دکمه
  const isButtonDisabled = adding || cartLoading || addedToCart;
  const buttonText = adding ? 'Adding...' : 
                    addedToCart ? 'Added to Cart ✓' : 
                    'Add to Cart';

  return (
    <div className='container main'>
      <div className={Style.singleItem}>
        <div
          className={Style.image}
          onMouseEnter={() => setShowMaxiImage(true)}
          onMouseLeave={() => setShowMaxiImage(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={dataProduct.image}
            alt={dataProduct.productName}
            className={Style.productImage}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className={Style.text}>
          <h1 className={Style.productName}>{dataProduct.productName}</h1>
          <hr className={Style.divider} />
          <div className={Style.info}>
            <div className={Style.infoItem}>
              <span className={Style.label}>Price:</span>
              <span className={Style.value}>{dataProduct.price} $</span>
            </div>
            <div className={Style.infoItem}>
              <span className={Style.label}>Model:</span>
              <span className={Style.value}>{dataProduct.model}</span>
            </div>
            <div className={Style.infoItem}>
              <span className={Style.label}>Category:</span>
              <span className={Style.value}>{dataProduct.section}</span>
            </div>
            <div className={Style.infoItem}>
              <span className={Style.label}>Description:</span>
              <p className={Style.description}>{dataProduct.description}</p>
            </div>
          </div>

          {addedToCart && (
            <div className={Style.cartStatus}>
              ✓ This product was successfully added to cart
            </div>
          )}

          {showMaxiImage && (
            <div 
              className={Style.imageMaximize}
              ref={imageMaximizeRef}
              onClick={() => setShowMaxiImage(false)}
            >
              <div className={Style.imageMaximizeContainer}>
                <img
                  src={dataProduct.image}
                  alt={dataProduct.productName}
                  style={{
                    position: "absolute",
                    left: `-${mousePosition.x * 0.5}px`,
                    top: `-${mousePosition.y * 0.5}px`,
                    transform: "scale(1.8)",
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
          className={`${Style.button} ${Style.btnAddtoCard} ${
            addedToCart ? Style.addedToCart : ''
          } ${adding ? Style.loading : ''}`}
          onClick={addProductBtn}
          disabled={isButtonDisabled}
        >
          {adding && <span className={Style.spinner}></span>}
          {buttonText}
        </button>
        <Link href={'/products'} className={Style.btnBack}>
          Back to Products
        </Link>
      </div>
    </div>
  );
}

// getServerSideProps بدون تغییر...
export async function getServerSideProps(context) {
  try {
    const { req, params } = context;
    const { singleItem } = params;
    
    let baseUrl;
    
    if (process.env.NODE_ENV === 'production') {
      const host = req.headers.host;
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      baseUrl = `${protocol}://${host}`;
    } else {
      baseUrl = 'http://localhost:3000';
    }
    
    console.log('Fetching from:', `${baseUrl}/api/products/${singleItem}`);
    
    const res = await fetch(`${baseUrl}/api/products/${singleItem}`);
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const data = await res.json();
    
    if (!data || !data.data) {
      return { notFound: true };
    }
    
    return {
      props: { 
        dataProduct: data.data 
      },
    };
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return { notFound: true };
  }
}