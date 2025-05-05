import Style from './BasketCard.module.css'
import Image from 'next/image';
import Link from 'next/link';
import { AppContext } from '@/pages/_app';
import { useContext } from 'react';
import Head from "next/head";
import Script from 'next/script';

export default function BasketCard ({
    _id, productName, price, image, count, totalPrice
})  {
    const {addToCard, setAddToCard, addProduct, setAddProduct} = useContext(AppContext);
    const increaseItem = () => {
        const UpdateProduct = [...addProduct]
        UpdateProduct.map(product => {
            if(product._id == _id) {
                product.count += 1;
                product.totalPrice = product.count * product.price
            }
        });
        setAddProduct(UpdateProduct);
    }
    const deacreseItem = () => {
        const UpdateProduct = [...addProduct];
        UpdateProduct.map(product => {
            if(product._id == _id) {
                product.count -= 1;
                product.totalPrice = product.count * product.price;
            }
        });
        setAddProduct(UpdateProduct);
    }
    const deleteItem = () => {
        setAddToCard(addToCard - 1);
        const removeItem = addProduct.filter(item => item._id !== _id);
        setAddProduct(removeItem);
    }

    const handleShareClick = async () => {
        const productLink = `${window.location.origin}/products/${_id}`;
        try {
            await navigator.clipboard.writeText(productLink);
            // alert(`Product link "${productName}" successfully copied!`);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('متاسفانه در کپی کردن لینک مشکلی پیش آمد.');
        }
    };
    return (
        <div className={Style.basketCard}>
            <Head>
                <title>Fake Store</title>
                <meta name="description" content="Store gold silver watch" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* Script fontawsome */}
            <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossorigin="anonymous"></Script>

            <Link href={`/products/${_id}`}>
                <div className={Style.imageContainer}>
                    <Image src={image} alt={productName} width={100} height={100} className={Style.image} />
                </div>
            </Link>     

            <div className={Style.info}>
                <p>Name:{productName}</p>
                <p>Price: {price}</p>
                <p>Total price: {totalPrice}</p>
            </div>

            <div className={Style.controlItem}>
                <div className={Style.quantity}>
                    <div className={Style.counter}>
                    {
                      count > 1 ? <button className={Style.deacreseBtn} onClick={deacreseItem}>-</button> : <button className={Style.btnRemove} onClick={deleteItem}>
                      <i data-fa-symbol="delete" color='red' class="fa-solid fa-trash fa-fw"></i></button>
                    }
        
                        {/* <button className={Style.deacreseBtn} onClick={deacreseItem}>-</button> */}
                        <p><b>{count}</b></p>
                        <button className={Style.increaseBtn} onClick={increaseItem}>+</button>
                    </div>

                    {/*  Container Delete */}
                    <div className={Style.Btn}>
                        {/* Remove the reduction Button of the product number  */}
                        <button className={Style.btnBuy}>Buy</button>
                    </div>
                </div>

                <div>
                    <button className={Style.btnRemove} onClick={deleteItem}>Delete</button>
                    <button className={Style.btnRemove} >Save</button>
                    <button className={Style.btnRemove} onClick={handleShareClick} >Share</button>
                </div>
            </div>
        </div>
    )
};


{/* <button className={Style.btnRemove} onClick={deleteItem}>
                        <i data-fa-symbol="delete" color='red' class="fa-solid fa-trash fa-fw"></i>
                    </button> */}