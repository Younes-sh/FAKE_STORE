import React from 'react';
import Style from "./styleProduct.module.css";
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({
    _id,
    productName,
    description,
    price,
    model,
    section,
    image
}) {
  return (
    <Link href={`/younessheikhlar/products/${_id}`} className={Style.productCard}>
        <div className={Style.imageContainer}>
          <Image src={image} alt={section} width={16} height={9} layout="responsive" objectFit="cover" />
        </div>
        <div className={Style.productInfo}>
          <h3>Name:{productName}</h3>
          <p>price:{price}</p>
          <p>{section}</p>
        </div>
    </Link>
  )
}
