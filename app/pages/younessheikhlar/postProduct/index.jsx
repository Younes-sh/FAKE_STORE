import React from 'react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import { useState } from 'react';
import Style from './style.module.css';
import {AlertModal} from '@/Components/AlertModal/AlertModal';

export default function PostProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        price: Number(price), // اطمینان از عدد بودن
        model,
        description,
        section: category,
        image,
      }),
    });

    // ابتدا وضعیت پاسخ را بررسی کنید
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to add product');
    }

    const data = await res.json();
    setShowSuccessModal(true);
    resetForm();

  } catch (error) {
    console.error('Error:', error);
    setErrorMessage(error.message || 'An error occurred while adding the product');
    setShowErrorModal(true);
  } finally {
    setIsSubmitting(false);
  }
}

// تابع برای ریست فرم
const resetForm = () => {
  setProductName('');
  setDescription('');
  setPrice('');
  setModel('');
  setCategory('');
  setImage('');
};

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  }

  return (
    <AdminLayout>
      <div className={Style.container}>
        <h1 className={Style.title}>Add New Product</h1>
        
        <form className={Style.form} onSubmit={handleSubmit}>
          <div className={Style.formGroup}>
            <label className={Style.label}>Product Name</label>
            <input
              type="text"
              className={Style.input}
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          
          <div className={Style.formGroup}>
            <label className={Style.label}>Price ($)</label>
            <input
              type="number"
              className={Style.input}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          
          <div className={Style.formGroup}>
            <label className={Style.label}>Model</label>
            <input
              type="text"
              className={Style.input}
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />
          </div>
          
          <div className={Style.formGroup}>
            <label className={Style.label}>Description</label>
            <textarea
              className={Style.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>
          
          <div className={Style.formGroup}>
            <label className={Style.label}>Category</label>
            <select
              className={Style.select}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="ring">Ring</option>
              <option value="necklace">Necklace</option>
              <option value="bracelet">Bracelet</option>
              <option value="watch">Watch</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="books">Books & Stationery</option>
            </select>
          </div>
          
          <div className={Style.formGroup}>
            <label className={Style.label}>Image URL</label>
            <input
              type="url"
              className={Style.input}
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
            {image && (
              <div className={Style.imagePreview}>
                <img src={image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className={Style.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* مودال موفقیت آمیز */}
      <AlertModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Success"
        message="Product added successfully!"
        type="success"
        confirmText="OK"
        showCancel={false}
        imageUrl={image}
      />

      {/* مودال خطا */}
      <AlertModal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        title="Error"
        message={errorMessage}
        type="error"
        confirmText="OK"
        showCancel={false}
      />
    </AdminLayout>
  )
}