import React, { useState , useEffect} from 'react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import ProductCard from '@/Components/Admin/Cards/ProductCard/ProductCard';
import InputSearch from '@/Components/Input/Input';
import ProductFilter from '@/Components/Filter/ProductFilter';
import { fetcher } from '@/utils/fetcher';

export default  function index({ productData }) {
  const [filteredProducts, setFilteredProducts] = useState(productData);

  return (
    <AdminLayout>
      <h1>Products</h1>
      <br/>

      {/* Input search, this input comes from (component input) */}
       <ProductFilter 
          products={productData} 
          onFilterChange={setFilteredProducts} 
        />
        
        <div className='row'>
            {filteredProducts.map(product => (
              <div className='col' key={product._id}>
                <ProductCard  {...product}/>
              </div>
            ))}
        </div>
    </AdminLayout>
  )
}

export async function getServerSideProps() {
  try {
    const data = await fetcher("/api/products");

    return {
      props: { productData: data.products || [] },
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      props: { productData: [] }, // اگر خطا رخ دهد، آرایه خالی برگردان
    };
  }
}
