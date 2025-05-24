import Styles from './TrackingTab.module.css';

export default function TrackingTab() {
  return (
    <div>
      <h3 className={Styles.tabTitle}>Track Your Order</h3>
      <div className={Styles.trackingForm}>
        <input 
          type="text" 
          placeholder="Enter order number or tracking code"
          className={Styles.trackingInput}
        />
        <button className={`${Styles.btn} ${Styles.primaryBtn}`}>
          Track
        </button>
      </div>
      <div className={Styles.trackingInfo}>
        {/* Tracking information will appear here */}
      </div>
    </div>
  );
}
