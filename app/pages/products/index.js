import React from 'react';
// import ProductCard from '@/Components/Cards/ProductCard/ProductCard';
import ProductCard from '@/Components/Cards/CardProductTest/CardProductTest';

import Style from "./style.module.css";

export default function index({ productData }) {
  return (
    <div className={Style.backgroundProduct}>
      <div className='container'>
        <h1>Products</h1>
        <div className='row'>
            {productData.map(product => (
              <div className='col' key={product._id}>
                <ProductCard  {...product}/>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}


export async function getServerSideProps() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products`);
    const data = await res.json();

    // بررسی اینکه آرایه معتبره و حذف مقادیر undefined/null
    const cleanedProducts = Array.isArray(data.products)
      ? data.products.filter(p => p && typeof p === 'object')
      : [];

    return {
      props: { productData: cleanedProducts }
    };
  } catch (error) {
    console.error("خطا در دریافت محصولات:", error);

    return {
      props: { productData: [] } // ارسال آرایه خالی در صورت خطا
    };
  }
}
