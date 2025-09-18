import { useState } from 'react';
import styles from './AvatarUploader.module.css';

export default function AvatarUploader({ currentAvatar, onAvatarChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // ایجاد فرم داده برای آپلود
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'profile_pictures');

      // آپلود به Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        // ذخیره URL تصویر در دیتابیس
        const saveResponse = await fetch('/api/updateAvatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ avatar: data.secure_url }),
        });

        if (saveResponse.ok) {
          onAvatarChange(data.secure_url);
          alert('Profile picture updated successfully!');
        } else {
          throw new Error('Error saving the image');
        }
      }
    } catch (error) {
      console.error('Error in uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // تابع handleRemoveAvatar که قبلاً تعریف نشده بود
  const handleRemoveAvatar = async () => {
    try {
      const response = await fetch('/api/removeAvatar', {
        method: 'POST',
      });

      if (response.ok) {
        onAvatarChange(null);
        alert('The profile picture has been deleted!');
      } else {
        throw new Error('Error in deleting image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarPreview}>
        {currentAvatar ? (
          <img 
            src={currentAvatar} 
            alt="Avatar" 
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <i className="fas fa-user"></i>
          </div>
        )}
        <div className={styles.avatarOverlay}>
          <i className="fas fa-camera"></i>
        </div>
      </div>
      
      <div className={styles.avatarInfo}>
        <h3>Profile picture</h3>
        <p>Change or remove your image. Recommended size: 300x300 pixels</p>
        
        {isUploading && (
          <div className={styles.uploadStatus}>
            <i className={`fas fa-spinner ${styles.uploadSpinner}`}></i>
            <span>Uploading... {uploadProgress}%</span>
          </div>
        )}
      </div>
      
      <div className={styles.avatarActions}>
        <label htmlFor="avatar-upload" className={`${styles.btn} ${styles.btnSecondary} ${styles.fileInputLabel}`}>
          <i className="fas fa-upload"></i>
          {isUploading ? 'Uploading...' : 'Change image'}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploading}
            style={{ display: 'none' }}
          />
        </label>
        
        <button 
          type="button" 
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={handleRemoveAvatar} 
          disabled={isUploading || !currentAvatar}
        >
          <i className="fas fa-trash"></i>
          Delete image
        </button>
      </div>
    </div>
  );
}