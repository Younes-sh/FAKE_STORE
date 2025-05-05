import { useState } from "react";
import Image from "next/image";
import Style from "./singleItem.module.css";
import Link from "next/link";

export default function SingleItem({ dataProduct }) {
  const [showMaxiImage, setShowMaxiImage] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  return (
    <div className='container main'>
      <div className={Style.singleItem}>
        <div
          className={Style.image}
          onMouseEnter={() => setShowMaxiImage(true)}
          onMouseLeave={() => setShowMaxiImage(false)}
          onMouseMove={(e) =>
            setMousePosition({
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            })
          }
        >
          <Image
            src={dataProduct.image}
            alt={dataProduct.section}
            width={16}
            height={9}
            layout="responsive"
          />
        </div>

        <div className={Style.text}>
          <p>
            <b>Name</b> {dataProduct.productName}
          </p>
          <hr />
          <div className={Style.info}>
            <p>
              <b>Price</b> {dataProduct.price} $
            </p>
            <p>
              <b>Model</b> {dataProduct.model}
            </p>
            <p>
              <b></b> {dataProduct.description}
            </p>
          </div>

          {/* Maximize image */}

          {showMaxiImage && (
            <div className={Style.imageMaximize}>
              <div className={Style.imageMaximizeContainer}>
                <Image
                  src={dataProduct.image}
                  alt={dataProduct.section}
                  width={3}
                  height={1}
                  layout="responsive"
                  style={{
                    position: "absolute",
                    left: -mousePosition.x,
                    top: -mousePosition.y,
                    transform: "scale(2)",
                  }}
                />
              </div>
              
            </div>
          )}
        </div>
      </div>

      <div className={Style.buttonContainer}>
        <button className={`${Style.button} ${Style.btnAddtoCard}`}>
          Add to cart
        </button>
        <Link href={'/products'} className={Style.btnBack}>Back to </Link>
        <button className={`${Style.button} ${Style.btnBuyNow}`}>
          Buy now
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { singleItem } = context.params;
  const res = await fetch(`http://localhost:3000/api/products/${singleItem}`);
  const data = await res.json();
  return {
    props: { dataProduct: data.data },
  };
}

