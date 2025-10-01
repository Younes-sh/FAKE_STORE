import React from 'react';
import Style from './header.module.css';

export default function Header() {
  return (
    <div className={Style.header}>
      <div className={Style.textHedearContainer}>
        <h4>CERTIFIED DIAMONDS</h4>
        <h1>PERSONAL TOUCH JEWELRY</h1>

        <button className={Style.button}>Shop now</button>
      </div>
    </div>
  )
}
