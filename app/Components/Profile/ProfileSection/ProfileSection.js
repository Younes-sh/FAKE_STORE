import { useState, useEffect } from 'react';
import styles from './ProfileSection.module.css';
import AvatarUploader from '../AvatarUploader/AvatarUploader';

export default function ProfileSection({ onUpdateUser }) {
  // مقدار اولیه کامل برای userData
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    bio: '',
    website: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
      number: '',
      floor: '',
      country: ''
    },
    avatar: '' // اضافه کردن فیلد avatar به state اولیه
  });

  const [avatar, setAvatar] = useState(userData.avatar || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // بارگذاری اطلاعات کاربر از API
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/updateUser');
        const data = await res.json();
        
        if (res.ok) {
          setUserData(prev => ({
            ...prev,
            firstname: data.firstname || '',
            lastname: data.lastname || '',
            username: data.username || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            website: data.website || '',
            avatar: data.avatar || '', // اضافه کردن avatar
            address: {
              street: data.address?.street || '',
              city: data.address?.city || '',
              postalCode: data.address?.postalCode || '',
              number: data.address?.number || '',
              floor: data.address?.floor || '',
              country: data.address?.country || ''
            }
          }));
          setAvatar(data.avatar || '');
        } else {
          console.error('خطا در دریافت اطلاعات کاربر:', data.message);
        }
      } catch (error) {
        console.error('خطا در دریافت اطلاعات کاربر:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setUserData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...userData, avatar}),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        onUpdateUser({...userData, avatar});
      } else {
        throw new Error('خطا در به‌روزرسانی پروفایل');
      }
    } catch (error) {
      console.error('خطا در به‌روزرسانی پروفایل:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.loading}>
          <i className="fas fa-spinner fa-spin"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>User profile</h2>
      
      <AvatarUploader 
        currentAvatar={avatar} 
        onAvatarChange={setAvatar}
      />
      
      <form onSubmit={handleSubmit}>
        {/* بقیه فرم */}
      </form>
    </div>
  );
}