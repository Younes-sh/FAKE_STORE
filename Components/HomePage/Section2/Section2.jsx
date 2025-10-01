import React from 'react';
import Style from './section2.module.css';
import Script from 'next/script';

export default function Section2() {
  return (
    <div className={Style.section2}>
      <Script src="https://kit.fontawesome.com/24d3f7dfbb.js" crossorigin="anonymous"></Script>
      

      <div className={Style.paragraphContainer}>
        <h3 className={Style.paragraph}>HIGHEST STANDARDS 
          Our products are certified by top laboratories, ensuring our gold mountings meet the highest ethical standards </h3>
      </div>
      <div className={Style.iconContainer}>
        <div>
          <b>Full-Service Production</b>
          <i class="fa-regular fa-gem"></i>
        </div>

        <div>
          <b>Customer-First Approach</b>
          <i class="fa-solid fa-users"></i>
        </div>

        <div>
          <b>European Quality</b>
          <i class="fa-solid fa-earth-africa"></i>
        </div>
      </div>
    </div>
  )
}
