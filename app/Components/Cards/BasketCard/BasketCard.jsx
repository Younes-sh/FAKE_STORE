// Components/Cards/BasketCard/BasketCard.js
import Style from './BasketCard.module.css';
import Image from 'next/image';
import BasketImage from '@/public/basket.png';
import Link from 'next/link';
import { useState } from "react";
import { useSession } from "next-auth/react";
import { AlertModal } from "@/Components/AlertModal/AlertModal";

export default function BasketCard({ 
  _id, 
  productName, 
  price, 
  image, 
  count, 
  totalPrice,
  description,
  section,
  model,
  onUpdate
}) {
  const { data: session } = useSession();
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleUpdateQuantity = async (newCount) => {
    if (loading || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: _id, count: newCount }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update quantity: ${res.status}`);
      }

      // Trigger global update and refresh parent
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      if (onUpdate) onUpdate();
      
    } catch (error) {
      console.error('Error updating product quantity:', error);
      setAlertMessage('Error updating quantity');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (loading || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: _id }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete item: ${res.status}`);
      }

      // Trigger global update and refresh parent
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      if (onUpdate) onUpdate();
      
    } catch (error) {
      console.error('Error deleting product:', error);
      setAlertMessage('Error deleting item');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const increaseItem = () => handleUpdateQuantity(count + 1);
  
  const decreaseItem = () => {
    if (count > 1) {
      handleUpdateQuantity(count - 1);
    } else {
      handleDeleteItem();
    }
  };

  const handleShareClick = async () => {
    try {
      const productLink = `${window.location.origin}/products/${_id}`;
      
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share({
          title: productName,
          text: description || 'Check out this product!',
          url: productLink,
        });
      } else if (navigator.clipboard) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(productLink);
        setAlertMessage('Product link copied to clipboard!');
        setShowAlert(true);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = productLink;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setAlertMessage('Product link copied!');
        setShowAlert(true);
      }
    } catch (err) {
      console.error('Error sharing product:', err);
      if (err.name !== 'AbortError') {
        setAlertMessage('Error sharing product');
        setShowAlert(true);
      }
    }
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  return (
    <div className={`${Style.basketCard} ${loading ? Style.loading : ''}`}>
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image 
            src={image || BasketImage} 
            alt={productName || 'Product image'} 
            width={120} 
            height={120} 
            className={Style.image}
            onError={(e) => {
              e.target.src = BasketImage;
            }}
          />
        </div>
      </Link>

      <div className={Style.info}>
        <h3 className={Style.productName}>{productName || 'Unknown Product'}</h3>
        {model && <p className={Style.model}>Model: {model}</p>}
        {section && <p className={Style.section}>Category: {section}</p>}
        
        <p className={Style.price}>Unit Price: {formatPrice(price)}</p>
        <p className={Style.totalPrice}>Total: {formatPrice(totalPrice)}</p>
      </div>

      <div className={Style.controlItem}>
        <div className={Style.quantity}>
          <h4>Quantity:</h4>
          <div className={Style.counter}>
            <button 
              className={Style.decreaseBtn} 
              onClick={decreaseItem} 
              disabled={loading}
              aria-label="Decrease quantity"
            >
              {count > 1 ? '-' : '🗑️'}
            </button>
            
            <span className={Style.count}>{count}</span>
            
            <button 
              className={Style.increaseBtn} 
              onClick={increaseItem} 
              disabled={loading}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <div className={Style.actionButtons}>
          <button 
            className={Style.btnDelete} 
            onClick={handleDeleteItem}
            disabled={loading}
            aria-label="Remove item from cart"
          >
            🗑️ Remove
          </button>
          
          <button 
            className={Style.btnShare} 
            onClick={handleShareClick}
            disabled={loading}
            aria-label="Share product"
          >
            🔗 Share
          </button>
        </div>
      </div>

      {loading && (
        <div className={Style.loadingOverlay}>
          <div className={Style.spinner}></div>
          <p>Updating...</p>
        </div>
      )}

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        title="Notification"
        message={alertMessage}
        confirmText="OK"
        showCancel={false}
        type="info"
      />
    </div>
  );
}