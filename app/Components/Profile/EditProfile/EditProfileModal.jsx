import { useState } from 'react';
import Styles from './modal.module.css';

export default function EditProfileModal({ user, onClose }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <div className={Styles.modalOverlay}>
      <div className={Styles.modal}>
        <div className={Styles.modalHeader}>
          <h2>Edit Profile</h2>
          <button onClick={onClose} className={Styles.closeButton}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={Styles.modalForm}>
          <div className={Styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className={Styles.formGroup}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className={Styles.passwordSection}>
            <h3>Change Password</h3>
            
            <div className={Styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className={Styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>
            
            <div className={Styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className={Styles.modalActions}>
            <button type="button" onClick={onClose} className={`${Styles.btn} ${Styles.secondaryBtn}`}>
              Cancel
            </button>
            <button type="submit" className={`${Styles.btn} ${Styles.primaryBtn}`}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}