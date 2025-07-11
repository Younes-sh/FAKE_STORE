import React from 'react';
// import ProductCard from '@/Components/Cards/ProductCard/ProductCard';
import ProductCard from '@/Components/Cards/CardProduct/CardProduct';

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
  const res = await fetch('http://localhost:3000/api/products');
  const data = await res.json();
  return {
    props: { productData: data.products}
  }
}