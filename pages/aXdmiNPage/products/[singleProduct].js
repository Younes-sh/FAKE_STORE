import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Style from './singleItem.module.css';
import Link from "next/link";
import AdminLayout from "@/Components/Admin/AdminLayout/Layout";
import {AlertModal} from "@/Components/AlertModal/AlertModal";
import UploadImage from "@/Components/UploadImage/UploadImage"; // اضافه کردن کامپوننت UploadImage

export default function SingleItemDashboard({dataProduct}) {
  const [productName, setProductName] = useState(dataProduct.productName);
  const [price, setPrice] = useState(dataProduct.price);
  const [model, setModel] = useState(dataProduct.model);
  const [description, setDescription] = useState(dataProduct.description);
  const [section, setSection] = useState(dataProduct.section);
  const [image, setImage] = useState(dataProduct.image);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const router = useRouter();
  const ID = router.query.singleProduct;

  // اضافه کردن useEffect برای چک ID و لود اولیه
  useEffect(() => {
    if (router.isReady && ID) {
      console.log('Product ID:', ID); // برای دیباگ
    } else {
      console.log('ID not ready or undefined'); // برای دیباگ
    }
  }, [router.isReady, ID]);

  const handleImageUploaded = (imageUrl) => {
    setImage(imageUrl);
  };

  // تابع برای ساخت baseUrl در کلاینت
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}//${window.location.host}`;
    }
    return ''; // در SSR خالی
  };

  const btnSave = async () => {
    if (!ID) {
      console.error('Product ID is missing');
      return;
    }

    const baseUrl = getBaseUrl();
    const apiUrl = baseUrl ? `${baseUrl}/api/products/${ID}` : `/api/products/${ID}`;

    const res = await fetch(apiUrl, {
      method: "PUT",
      body: JSON.stringify({
        productName,
        price,
        model,
        description,
        section,
        image
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

     if (res.ok) {
      setShowSaveModal(true); // نمایش مودال موفقیت
    } else {
      console.error('Failed to update product:', await res.text());
    }
  }

  const handleDelete = async () => {
    if (!ID) {
      console.error('Product ID is missing');
      return;
    }

    const baseUrl = getBaseUrl();
    const apiUrl = baseUrl ? `${baseUrl}/api/products/${ID}` : `/api/products/${ID}`;

    const res = await fetch(apiUrl, {
      method: "DELETE"
    });

    if (res.ok) {
      router.push(`/aXdmiNPage/products/`);
    } else {
      console.error('Failed to delete product:', await res.text());
    }
  }

  const confirmDelete = () => {
    setShowDeleteModal(true);
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
  }

  const handleSaveSuccess = () => {
    setShowSaveModal(false);
    router.push(`/aXdmiNPage/products/`);
  }

  return (
    <AdminLayout>
      <div className="container main">
        <div className={Style.singleItemPage}>
          <div className={Style.image}>
            {image ? (
              <Image.default 
                src={image} 
                alt={productName} 
                width={16} 
                height={9} 
                layout="responsive" 
                objectFit="cover" 
              />
            ) : (
              <div className={Style.placeholderImage}>No Image</div>
            )}
          </div>
          
          <div className={Style.textContainer}>
            <div className={Style.formInput}>
              <label>
                Product Name
                <input type="text" onChange={(e) => setProductName(e.target.value)} value={productName} />
              </label>

              <label>
                Price
                <input type="text" onChange={(e) => setPrice(e.target.value)} value={price} />
              </label>

              <label>
                Model
                <input type="text" onChange={(e) => setModel(e.target.value)} value={model} />
              </label>

              <label>
                Section
                <input type="text" onChange={(e) => setSection(e.target.value)} value={section} />
              </label>

              <label>
                Product Image
                <UploadImage onUploaded={handleImageUploaded} />
                {image && (
                  <div className={Style.imagePreviewContainer}>
                    <button
                      type="button"
                      className={Style.removeImageButton}
                      onClick={() => setImage('')}
                    >
                      Remove Current Image
                    </button>
                  </div>
                )}
              </label>

              <label>
                Description
                <br />
                <textarea 
                  className={Style.textarea} 
                  type="text" 
                  onChange={(e) => setDescription(e.target.value)} 
                  value={description} 
                  rows={7} 
                  cols={90}  
                />
              </label>
            </div>
          </div>
        </div>

        <div className={Style.buttonContainer}>
          <button className={Style.btnSave} onClick={btnSave}>
            Save
          </button>
          <Link href={`/aXdmiNPage/products`}>Back</Link>
          <button className={Style.btnDelete} onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </div>

      {/* AlertModal برای تأیید حذف */}
      <AlertModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productName}"? This action cannot be undone.`}
        imageUrl={image}
        type="error"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        showCancel={true}
      />

      {/* مودال ذخیره موفقیت آمیز */}
      <AlertModal
        isOpen={showSaveModal}
        onClose={handleSaveSuccess}
        title="Success"
        message="Product updated successfully!"
        imageUrl={image}
        type="success"
        confirmText="OK"
        showCancel={false}
      />
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  const {singleProduct} = context.params;
  try {
    // ساخت URL کامل برای API
    const host = context.req.headers.host;
    const protocol = context.req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const res = await fetch(`${baseUrl}/api/products/${singleProduct}`);
    
    if (!res.ok) {
      return { notFound: true };
    }
    
    const data = await res.json();
    
    return {
      props: { dataProduct: data.data }
    };
  } catch (error) {
    console.error('Error fetching product data:', error);
    return { notFound: true };
  }
}