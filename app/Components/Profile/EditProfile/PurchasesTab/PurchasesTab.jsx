import Styles from './PurchasesTab.module.css';

export default function PurchasesTab({ products }) {
  return (
    <div>
      <h3 className={Styles.tabTitle}>Purchase History</h3>
      <div className={Styles.productsList}>
      {products?.length > 0 ? (
        products.map(product => (
          <div key={product.id} className={Styles.productItem}>
            <div className={Styles.productInfo}>
              <h4>{product.name}</h4>
              <p>Purchase Date: {product.date}</p>
              <p className={Styles[`status-${product.status.toLowerCase()}`]}>
                Status: {product.status}
              </p>
            </div>
            <button className={`${Styles.btn} ${Styles.smallBtn}`}>Details</button>
          </div>
        ))
      ) : (
        <p>No purchases found!</p>
      )}

      </div>
    </div>
  );
}
