import Style from "./style.module.css";
import React from 'react'
import ImageTest from "@/public/backgroundWatch.jpg";
import Image from "next/image";
export default function ProductCard() {
  return (
    <div className={Style.productCard}>
        <div className={Style.imageContainer}>
          <Image src={ImageTest} alt="Product" />
        </div>
        <div className={Style.TextContainer}>
          <h3>Product Name</h3>
          <p>Product Description</p>
          <p>Price: $9.99</p>
          <div className={Style.buttonContainer}>
            <button className={Style.btnAddToCard}>Add to Cart</button>
            <button className={Style.btnBuy}>Buy Now</button>
          </div>
        </div>
    </div>
  )
}
