import React from 'react';
import ProductCard from '@/Components/Cards/ProductCard/ProductCard';

export default function index() {
  return (
    <div className='container main'>
      <h1>Products</h1>
      <div className='row'>
        <div className='col'>
          <ProductCard />
        </div>

        <div className='col'>
          <ProductCard />
        </div>

        <div className='col'>
          <ProductCard />
        </div>

        <div className='col'>
          <ProductCard />
        </div>
      </div>
    </div>
  )
}
