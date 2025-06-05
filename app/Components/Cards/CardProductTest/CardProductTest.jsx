import Style from "./style.module.css";
import React, { useContext } from 'react';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/router';
import { AppContext } from '@/Components/AppContextProvider';

export default function ProductCard({
  _id, productName, description, price, model, section, image, count
}) {
  const router = useRouter();
  const {
    addToCard,
    setAddToCard,
    addProduct,
    setAddProduct
  } = useContext(AppContext);

  const addProductBtn = async () => {
  try {
    const existingItem = addProduct.find(item => item._id === _id);
    const newQuantity = existingItem ? existingItem.count + 1 : 1;

    const response = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: _id,
        quantity: newQuantity // 👈 ارسال تعداد جدید
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "خطا در افزودن به سبد خرید");
    }

    // حالا وضعیت context را بروزرسانی می‌کنیم
    let updatedAddProduct;

    if (existingItem) {
      updatedAddProduct = addProduct.map(item => {
        if (item._id === _id) {
          const updatedCount = item.count + 1;
          return {
            ...item,
            count: updatedCount,
            totalPrice: updatedCount * item.price
          };
        }
        return item;
      });
    } else {
      const newItem = {
        _id,
        productName,
        price,
        count: 1,
        totalPrice: price,
        image
      };
      updatedAddProduct = [...addProduct, newItem];

      setAddToCard(prev => prev + 1);
    }

    setAddProduct(updatedAddProduct);

  } catch (error) {
    console.error("خطا:", error);
    alert(error.message);
  }
};

  const buyNowHandler = () => {
    const tempOrder = {
      items: [{
        _id,
        productName,
        price,
        count: 1,
        totalPrice: price,
        image
      }],
      totalAmount: price
    };

    localStorage.setItem('tempOrder', JSON.stringify(tempOrder));
    router.push('/checkout');
  };

  return (
    <div className={Style.productCard}>
      <Link href={`/products/${_id}`} className={Style.Link}>
        <div className={Style.imageContainer}>
          <Image
            src={image}
            alt={productName}
            width={16}
            height={9}
            layout="responsive"
            objectFit="cover"
          />
        </div>
      </Link>
      <div className={Style.TextContainer}>
        <h4>{productName}</h4>
        <p>Price: {price}</p>
        <div className={Style.buttonContainer}>
          <button className={Style.btnAddToCard} onClick={addProductBtn}>
            Add to Cart
          </button>
          <button className={Style.btnBuy} onClick={buyNowHandler}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
