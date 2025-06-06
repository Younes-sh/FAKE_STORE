import { useEffect, useState } from 'react';
import Styles from './modal.module.css';

export default function EditProfileModal({ onClose, open }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
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
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            postalCode: data.address?.postalCode || '',
            country: data.address?.country || ''
          }));
        } else {
          alert(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        alert('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/updateUser', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully');
        onClose();
      } else {
        alert(data.message || 'Update failed');
      }
    } catch {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={`${Styles.modalOverlay}`}>
      <div className={Styles.modal}>
        <div className={Styles.modalHeader}>
          <h2>Edit Profile</h2>
          <button onClick={onClose} className={Styles.closeButton}>&times;</button>
        </div>
        {loading ? (
          <div className={Styles.loading}>Loading...</div>
        ) : (
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
              <div className={Styles.formGroup}>
                <label htmlFor="street">Street</label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={Styles.formGroup}>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
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
        )}
      </div>
    </div>
  );
}