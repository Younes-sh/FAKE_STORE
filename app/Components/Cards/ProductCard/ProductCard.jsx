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

  const addProductBtn = () => {
    
    if(isExisteProduct()){
      const UpdateProduct = [...addProduct]
      UpdateProduct.map(product => {
        if(product._id === _id) {
          product.count += 1;
          product.totalPrice = product.price * product.count
        }
        setAddProduct(UpdateProduct);
        return 
      })
    }else {
        setAddToCard(addToCard + 1);
        const newProduct = {
          _id,
          productName,
          price,
          count: 1, // مقدار اولیه تعداد
          totalPrice: price * 1, // مقدار اولیه قیمت کل
          image
          // ... سایر پراپرتی های مورد نیاز
        };
        setAddProduct( prevent => [...prevent, newProduct]);
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
