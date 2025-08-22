import React, { useState } from 'react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import Style from './style.module.css';
import { AlertModal } from '@/Components/AlertModal/AlertModal';
import UploadImage from '@/Components/UploadImage/UploadImage';
import { fetcher } from '@/utils/fetcher';

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

  const resetForm = () => {
    setProductName('');
    setDescription('');
    setPrice('');
    setModel('');
    setCategory('');
    setImage('');
  };

  const handleImageUploaded = (imageUrl) => {
    setImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!image) throw new Error('لطفاً ابتدا تصویر را آپلود کنید.');
      // fetcher is a utility function for making API requests (/utils/fetcher.js)!
      const res = await fetcher('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName,
          price: Number(price),
          model,
          description,
          section: category,
          image,
        }),
      });

     
      setShowSuccessModal(true);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An error occurred while adding the product');
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <option value="books">Earing</option>
              <option value="books">Books & Stationery</option>
            </select>
          </div>

          <div className={Style.formGroup}>
            <label className={Style.label}>Product Image</label>
            <UploadImage onUploaded={handleImageUploaded} />
            {image && (
              <div className={Style.imagePreview}>
                <img src={image} alt="Preview" className={Style.previewImage} />
                <button
                  type="button"
                  className={Style.removeImageButton}
                  onClick={() => setImage('')}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={Style.submitButton}
            disabled={isSubmitting || !image}
          >
            {isSubmitting ? 'Submitting...' : 'Add Product'}
          </button>
        </form>
      </div>

      <AlertModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
        message="Product added successfully!"
        type="success"
        confirmText="OK"
        showCancel={false}
        imageUrl={image}
      />

      <AlertModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error"
        message={errorMessage}
        type="error"
        confirmText="OK"
        showCancel={false}
      />
    </AdminLayout>
  );
}