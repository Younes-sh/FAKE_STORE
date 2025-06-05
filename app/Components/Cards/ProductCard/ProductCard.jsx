import Style from "./style.module.css";
import React, { useContext } from 'react';
import Image from "next/image";
import Link from "next/link";
import { AppContext } from '../../../pages/_app';

export default function ProductCard({
  _id, productName, description, price, model, section, image, count
}) {
  const {
    addToCard,
    setAddToCard,
    addProduct,
    setAddProduct
  } = useContext(AppContext);

  const addProductBtn = async () => {
  let updatedProducts;

  if (isExisteProduct()) {
    updatedProducts = addProduct.map(product => {
      if (product._id === _id) {
        const newCount = product.count + 1;
        return {
          ...product,
          count: newCount,
          totalPrice: product.price * newCount
        };
      }
      return product;
    });

    setAddProduct(updatedProducts);
  } else {
    setAddToCard(addToCard + 1);
    const newProduct = {
      _id,
      productName,
      price,
      count: 1,
      totalPrice: price,
      image
    };
    updatedProducts = [...addProduct, newProduct];
    setAddProduct(updatedProducts);
  }

  // ارسال اطلاعات به API با fetch
  try {
    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // اگر احراز هویت با توکن دارید، می‌تونید اینجا Authorization هم اضافه کنید
      },
      body: JSON.stringify({
        productId: _id,
        quantity: 1
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('خطا در ذخیره‌سازی سمت سرور:', errorData);
    }
  } catch (error) {
    console.error('خطای ارتباط با سرور:', error.message);
  }
};


  function isExisteProduct () {
    return addProduct.some(product => product._id === _id);
  }

  return (
    <div className={Style.productCard}>
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image src={image} alt={productName} width={16} height={9} layout="responsive" objectFit="cover" />
        </div>
      </Link>
      <div className={Style.TextContainer}>
        <h4>{productName}</h4>
        <p>Price: {price}</p>
        <div className={Style.buttonContainer}>
          <button className={Style.btnAddToCard} onClick={addProductBtn}>
            Add to Cart
          </button>
          <button className={Style.btnBuy}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}
