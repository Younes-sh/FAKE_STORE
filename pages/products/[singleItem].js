import { useState, useEffect, useContext, useRef, useCallback, useMemo } from "react";
import Style from "./singleItem.module.css";
import Link from "next/link";
import { useRouter } from 'next/router';
import { AppContext } from "@/pages/_app";
import { useCart } from '@/contexts/CartContext';

// کامپوننت خطا برای استفاده مجدد
const ErrorState = () => (
  <div className={Style.errorState}>
    <h2>محصول یافت نشد</h2>
    <p>محصولی که به دنبال آن هستید وجود ندارد یا حذف شده است.</p>
    <Link href={'/products'} className={Style.btnBack}>
      ← بازگشت به محصولات
    </Link>
  </div>
);

// کامپوننت اطلاعات محصول
const ProductInfo = ({ dataProduct }) => (
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
);

// کامپوننت دکمه‌ها
const ActionButtons = ({ 
  adding, 
  addedToCart, 
  cartLoading, 
  onAddToCart, 
  isButtonDisabled 
}) => {
  const buttonText = useMemo(() => {
    if (adding) return 'Adding...';
    if (addedToCart) return 'Added to Cart ✓';
    return 'Add to Cart';
  }, [adding, addedToCart]);

  return (
    <div className={Style.buttonContainer}>
      <button 
        className={`${Style.button} ${Style.btnAddtoCard} ${
          addedToCart ? Style.addedToCart : ''
        } ${adding ? Style.loading : ''}`}
        onClick={onAddToCart}
        disabled={isButtonDisabled}
      >
        {adding && <span className={Style.spinner}></span>}
        {buttonText}
      </button>
      <Link href={'/products'} className={Style.btnBack}>
        Back to Products
      </Link>
    </div>
  );
};

export default function SingleItem({ dataProduct }) {
  const router = useRouter();
  const { setAddToCard } = useContext(AppContext);
  const { addToCart, isProductInCart, loading: cartLoading } = useCart();
  
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [adding, setAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const imageContainerRef = useRef(null);
  const zoomImageRef = useRef(null);

  // بررسی اینکه آیا محصول در سبد هست
  const isInCart = useMemo(() => 
    dataProduct?._id ? isProductInCart(dataProduct._id) : false,
    [dataProduct?._id, isProductInCart]
  );

  // وقتی محصول در سبد قرار می‌گیرد، addedToCart را true کنیم
  useEffect(() => {
    if (isInCart) {
      setAddedToCart(true);
    }
  }, [isInCart]);

  const addProductBtn = useCallback(async () => {
    if (adding || !dataProduct || addedToCart) return;
    
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
        setAddedToCart(true);
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
  }, [adding, dataProduct, addedToCart, addToCart, isInCart, setAddToCard]);

  const handleMouseMove = useCallback((e) => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // محدود کردن موقعیت به داخل تصویر
    const boundedX = Math.max(0, Math.min(x, rect.width));
    const boundedY = Math.max(0, Math.min(y, rect.height));
    
    setMousePosition({ 
      x: boundedX, 
      y: boundedY 
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none';
  }, []);

  // محاسبه موقعیت برای بزرگنمایی
  const zoomStyle = useMemo(() => {
    if (!isHovered) return {};
    
    const zoomLevel = 2;
    const backgroundX = (mousePosition.x / (imageContainerRef.current?.offsetWidth || 1)) * 100;
    const backgroundY = (mousePosition.y / (imageContainerRef.current?.offsetHeight || 1)) * 100;

    return {
      backgroundImage: `url(${dataProduct.image})`,
      backgroundPosition: `${backgroundX}% ${backgroundY}%`,
      backgroundSize: `${zoomLevel * 100}%`,
      backgroundRepeat: 'no-repeat',
      transform: 'scale(1.1)',
      zIndex: 10
    };
  }, [isHovered, mousePosition, dataProduct.image]);

  // وضعیت دکمه
  const isButtonDisabled = adding || cartLoading || addedToCart;

  if (!dataProduct) {
    return (
      <div className='container main'>
        <div className={Style.singleItem}>
          <ErrorState />
        </div>
      </div>
    );
  }

  return (
    <div className='container main'>
      <div className={Style.singleItem}>
        <div className={Style.imageSection}>
          <div
            ref={imageContainerRef}
            className={Style.imageContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <img
              src={dataProduct.image}
              alt={dataProduct.productName}
              className={Style.productImage}
              onError={handleImageError}
              loading="lazy"
            />
            
            {/* تصویر بزرگ‌شده که روی محتوای سمت راست می‌رود */}
            <div 
              ref={zoomImageRef}
              className={`${Style.zoomedImage} ${isHovered ? Style.active : ''}`}
              style={zoomStyle}
            />
            
            <div className={`${Style.zoomOverlay} ${isHovered ? Style.active : ''}`}>
              <span>🔍 Hover to zoom</span>
            </div>
          </div>
        </div>

        <div className={Style.textContent}>
          <h1 className={Style.productName}>{dataProduct.productName}</h1>
          <hr className={Style.divider} />
          
          <ProductInfo dataProduct={dataProduct} />
          
          <ActionButtons 
            adding={adding}
            addedToCart={addedToCart}
            cartLoading={cartLoading}
            onAddToCart={addProductBtn}
            isButtonDisabled={isButtonDisabled}
          />

          {addedToCart && (
            <div className={Style.cartStatus}>
              ✓ This product was successfully added to cart
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// getServerSideProps بدون تغییر
export async function getServerSideProps(context) {
  try {
    const { req, params } = context;
    const { singleItem } = params;
    
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction 
      ? `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
      : 'http://localhost:3000';
    
    console.log('Fetching from:', `${baseUrl}/api/products/${singleItem}`);
    
    const res = await fetch(`${baseUrl}/api/products/${singleItem}`);
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const data = await res.json();
    
    if (!data?.data) {
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