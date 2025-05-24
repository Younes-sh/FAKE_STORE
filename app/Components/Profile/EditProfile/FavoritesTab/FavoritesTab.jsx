import Image from 'next/image';
import Styles from './FavoritesTab.module.css';

export default function FavoritesTab({ products }) {
  return (
    <div>
      <h3 className={Styles.tabTitle}>Favorite Products</h3>
      <div className={Styles.favoritesGrid}>
      {products?.length > 0 ? (
  products.map(product => (
    <div key={product.id} className={Styles.favoriteItem}>
      {/* Product rendering here */}
    </div>
  ))
) : (
  <p>No favorite products found.</p>
)}

      </div>
    </div>
  );
}
