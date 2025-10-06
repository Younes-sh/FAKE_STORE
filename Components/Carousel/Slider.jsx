import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Link from 'next/link';

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const MyCarousel = ({ images }) => {
  return (
    <Carousel
      responsive={responsive}
      infinite={true}
      autoPlay={true}
      autoPlaySpeed={3000}
      arrows={true}
    >
      {images.map((image, index) => (
        <div key={index} style={{ padding: '10px' }}>
          <Link href={'/products'}>
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={image} alt={`Image ${index + 1}`} style={{ width: '100%', display: 'block' }} />
            </div>
          </Link>
        </div>
      ))}
    </Carousel>
  );
};

// مثال استفاده در یک کامپوننت دیگر:
const ImageGallery = () => {
  const imageList = [
    'asset/images/image1.jpg',
    'asset/images/image2.jpg',
    'asset/images/image3.jpg',
    'asset/images/image4.jpg',
    'asset/images/image5.jpg',
    'asset/images/image6.jpg',
    'asset/images/image7.jpg',
  ];

  return (
    <div style={{width:'100%'}}>
        <MyCarousel images={imageList} />
    </div>
  );
};

export default ImageGallery;