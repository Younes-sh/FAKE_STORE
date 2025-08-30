// import ProductCard from '@/Components/Cards/ProductCard/ProductCard';
import ProductCard from '@/Components/Cards/CardProduct/CardProduct';
import {useState} from 'react';
import ProductFilter from '@/Components/Filter/ProductFilter';
import Style from "./style.module.css";
import Footer from "@/Components/Footer";

export default function index({ productData }) {
  const [filteredProducts, setFilteredProducts] = useState(productData);

  return (
    <div className={Style.backgroundProduct}>
      <div className='container'>

        {/* اضافه کردن کامپوننت فیلتر */}
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
      </div>
      <Footer />
    </div>
  )
}


export async function getServerSideProps() {
  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  const res = await fetch(`/api/products`);
  const data = await res.json();

  return {
    props: { productData: data.products }
  }
}