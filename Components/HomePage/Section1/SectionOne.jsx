import React from 'react';
import Style from './sectionOne.module.css';
import MySlider from '@/Components/Carosel/Slider';

export default function SectionOne() {
  return (
    <div className={Style.sectionOne}>
        <div className={Style.sliderContainer}>
          <MySlider />
        </div>
    </div>
  )
}
