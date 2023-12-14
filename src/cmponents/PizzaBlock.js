import React from "react";
import { useState } from "react";

function PizzaBlock({ title, price, image, sizes, types }) {
  const [count, setCount] = React.useState(0);
  const onClickButon = () => setCount(count + 1);
  console.log("render", count);
  console.log(title, sizes, types);

  // 1
  const [indexSize, setIndexsiese] = useState(0);
  // 2
  const [typeIndex, setTypeIndex] = useState(0);
  const typeNames = ["тонкое", "традиционное"];
  // const typeNames = [
  //   { type: types[0], name: "тонкое" },
  //   { type: types[1], name: "традиционное" },
  // ];

  return (
    <div className='pizza-block'>
      <img
        className='pizza-block__image'
        src={image}
        alt='Pizza'
      />
      <h4 className='pizza-block__title'>{title}</h4>
      <div className='pizza-block__selector'>
        <ul>
          {types.map((typeId) => (
            <li
              key={typeId}
              className={typeIndex === typeId ? "active" : ""}
              onClick={() => setTypeIndex(typeId)}>
              {typeNames[typeId]}
            </li>
          ))}
          {/* <li className='active'>тонкое</li>
          <li>традиционное</li> */}
        </ul>
        <ul>
          {sizes.map((size, i) => (
            <li
              key={size}
              className={indexSize === i ? "active" : ""}
              onClick={() => setIndexsiese(i)}>
              {size} см
            </li>
          ))}
        </ul>
      </div>
      <div className='pizza-block__bottom'>
        <div className='pizza-block__price'>от {price} ₽</div>
        <button
          className='button button--outline button--add'
          onClick={onClickButon}>
          <svg
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z'
              fill='white'
            />
          </svg>
          <span>Добавить</span>
          <i>{count}</i>
        </button>
        s
      </div>
    </div>
  );
}

export default PizzaBlock;
