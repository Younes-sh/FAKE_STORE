import { useEffect, useState } from 'react';
import Styles from './modal.module.css';

export default function EditProfileModal({ onClose }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      number: '',
      floor: '',
      country: ''
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/getUser');
        const data = await res.json();

        if (res.ok) {
          setFormData(prev => ({
          ...prev,
          firstname: data.firstname || '',
          lastname: data.lastname || '',
          username: data.username || '',
          email: data.email || '',
          phone: data.phone || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            postalCode: data.address?.postalCode || '',
            number: data.address?.number || '',
            floor: data.address?.floor || '',
            country: data.address?.country || ''
          }
        }));

        } else {
          alert(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        console.error('Fetch user error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith('address.')) {
    const field = name.split('.')[1];
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/updateUser', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Profile updated successfully');
      onClose();
    } else {
      alert(data.message || 'Update failed');
    }
  };

  if (loading) return <div>Loading...</div>;

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
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className={Styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
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
              disabled
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
          
          <h3>Address</h3>

<div className={Styles.formGroup}>
  <label htmlFor="address.street">Street</label>
  <input
    type="text"
    id="address.street"
    name="address.street"
    value={formData.address.street}
    onChange={handleChange}
  />
</div>

<div className={Styles.formGroup}>
  <label htmlFor="address.city">City</label>
  <input
    type="text"
    id="address.city"
    name="address.city"
    value={formData.address.city}
    onChange={handleChange}
  />
</div>

<div className={Styles.formGroup}>
  <label htmlFor="address.postalCode">Postal Code</label>
  <input
    type="text"
    id="address.postalCode"
    name="address.postalCode"
    value={formData.address.postalCode}
    onChange={handleChange}
  />
</div>

<div className={Styles.formGroup}>
  <label htmlFor="address.number">Building Number</label>
  <input
    type="text"
    id="address.number"
    name="address.number"
    value={formData.address.number}
    onChange={handleChange}
  />
</div>

<div className={Styles.formGroup}>
  <label htmlFor="address.floor">Floor</label>
  <input
    type="text"
    id="address.floor"
    name="address.floor"
    value={formData.address.floor}
    onChange={handleChange}
  />
</div>

<div className={Styles.formGroup}>
  <label htmlFor="address.country">Country</label>
  <input
    type="text"
    id="address.country"
    name="address.country"
    value={formData.address.country}
    onChange={handleChange}
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