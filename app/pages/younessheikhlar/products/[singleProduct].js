import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Style from './singleItem.module.css';
import Link from "next/link";
import AdminLayout from "@/Components/Admin/AdminLayout/Layout";
import {AlertModal} from "@/Components/AlertModal/AlertModal"; // مسیر صحیح به کامپوننت AlertModal

export default function SingleItemDashboard({dataProduct}) {
  const [productName, setProductName] = useState(dataProduct.productName);
  const [price, setPrice] = useState(dataProduct.price);
  const [model, setModel] = useState(dataProduct.model);
  const [description, setDescription] = useState(dataProduct.description);
  const [section, setSection] = useState(dataProduct.section);
  const [image, setImage] = useState(dataProduct.image);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const IDProduct = useRouter();
  const ID = IDProduct.query.singleProduct;
  const router = useRouter();

  const btnSave = async () => {
    const res = await fetch(`/api/products/${ID}`, {
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
      console.error('Failed to update product');
    }
  }

  const handleDelete = async () => {
    const res = await fetch(`/api/products/${ID}`, {
      method: "DELETE"
    });

    if (res.ok) {
      router.push(`/younessheikhlar/products/`);
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
    router.push(`/younessheikhlar/products/`);
  }

  return (
    <AdminLayout>
      <div className="container main">
        <div className={Style.singleItemPage}>
          <div className={Style.image}>
            <Image 
              src={dataProduct.image} 
              alt={dataProduct.section} 
              width={16} 
              height={9} 
              layout="responsive" 
              objectFit="cover" 
            />
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
                Image
                <input type="text" onChange={(e) => setImage(e.target.value)} value={image} />
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
          <Link href={`/younessheikhlar/products`}>Back</Link>
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
  const res = await fetch(`http://localhost:3000/api/products/${singleProduct}`);
  const data = await res.json();
  return {
    props: { dataProduct: data.data }
  }
}