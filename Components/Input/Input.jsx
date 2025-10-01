import React from 'react';
import Style from './input.module.css';

export default function Input({
    valueSearch
}) {
  return (
    <input className={Style.input} value={valueSearch}/>
  )
}
