import React, { useState } from 'react';
import AdminLayout from '@/Components/AdminLayout/AdminLayout';
import ProductCard from '@/Components/Admin/Cards/ProductCard/ProductCard';

export default  function index({ productData }) {
  
  return (
    <AdminLayout>
      <h1>Products</h1>
      
      <div className='row'>
          {productData.map(product => (
        <div className='col'>
            <ProductCard key={product._id} {...product}/>
        </div>
          ))}
      </div>
    </AdminLayout>
  )
}

export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/products');
  const data = await res.json();
  return {
    props: { productData: data.products}
  }
}