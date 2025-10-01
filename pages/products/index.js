// import ProductCard from '@/Components/Cards/ProductCard/ProductCard';
import ProductCard from '@/Components/Cards/CardProduct/CardProduct';
import {useState} from 'react';
import ProductFilter from '@/Components/Filter/ProductFilter';
import Style from "./style.module.css";
import Footer from "@/Components/Footer";
import Head from 'next/head';

export default function index({ productData }) {
  const [filteredProducts, setFilteredProducts] = useState(productData);

  return (
    <div className={Style.backgroundProduct}>
      <Head>
        <title>Shop - Products</title>
        <meta name="description" content="A variety of products at the best prices" />
        <meta name="keywords" content="products, shopping, store" />
      </Head>
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




export async function getServerSideProps({ req }) {
  try {
    // ساخت آدرس کامل بر اساس درخواست ورودی
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const res = await fetch(`${baseUrl}/api/products`);
    
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    
    const data = await res.json();
    
    return {
      props: { productData: data.products || [] }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    
    return {
      props: { productData: [] }
    };
  }
}