import React, { useState , useEffect} from 'react';
import AdminLayout from '@/Components/Admin/AdminLayout/Layout';
import ProductCard from '@/Components/Admin/Cards/ProductCard/ProductCard';
import InputSearch from '@/Components/Input/Input';

export default  function index({ productData }) {
  const [textSearch, setTextSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(productData);

  // useEffect(() => {
  //   const filtered = productData.filter(product =>
  //     product.name.toLowerCase().includes(textSearch.toLowerCase())
  //   );
  //   setFilteredProducts(filtered);
  // }, [textSearch, productData]);

  
  return (
    <AdminLayout>
      <h1>Products</h1>
      <br/>

      {/* Input search, this input comes from (component input) */}
      <InputSearch onChange={(e) => setTextSearch(e.target.value)}  />

      <div className='row'>
          {productData.map(product => (
        <div className='col' key={product._id}>
          <ProductCard  {...product}/>
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