import React from 'react';
import AdminLayout from '@/Components/AdminLayout/AdminLayout';
import Style from "./style.module.css";
import { useState } from 'react';

export default function index() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [model, setModel] = useState('');
  const [section, setSection] = useState('');
  const [image, setImage] = useState('');
  
  // handle submit form
  const handleSubmit = async () => {
    const res = await fetch(`/api/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productName,
        price,
        model,
        description,
        section,
        image,
      }),
    })
    const data = await res.json();
    console.log(data);
  }
  return (
    <AdminLayout>
      <h1>Post product</h1>
      <div className={Style.post}>
        <form>
          <lable>Product Name</lable>
          <input onChange={(e) => setProductName(e.target.value)} value={productName} type='text' />
          
          <lable>Price</lable>
          <input onChange={(e) => setPrice(e.target.value)} value={price} type='text' />
          
          <lable>Model</lable>
          <input onChange={(e) => setModel(e.target.value)} value={model} type='text' />
          
          <lable>Description</lable>
          <input onChange={(e) => setDescription(e.target.value)} value={description} type='text' />

          
          <lable>Section</lable>
          <input onChange={(e) => setSection(e.target.value)} value={section} type='text' />

          <lable>Image</lable>
          <input onChange={(e) => setImage(e.target.value)} value={image} type='text' />
          
          <button onClick={handleSubmit} >Post</button>
        </form>
      </div>
    </AdminLayout>
  )
}

