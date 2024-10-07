import React from "react";
import { useState } from "react";

function PizzaBlock({ title, price, imageUrl, sizes, types, onSetButon }) {
  // 3
  const [count, setCount] = React.useState(0);
  // const onSetButon = () => setCount(count + 1);
  // console.log("render", count);
  // console.log(title, sizes, types);

  // 1
  const [indexSize, setIndexsiese] = useState(0);
  // 2
  const [typeIndex, setTypeIndex] = useState(0);
  const typeNames = ["тонка", "традиційна"];

  // const typeNames = [
  //   { type: types[0], name: "тонкое" },
  //   { type: types[1], name: "традиционное" },
  // ];
  // 4 rating
  // Рейтинг у вигляді зірочок
  const totalStars = 5; // Максимальна кількість зірочок
  const [userRating, setUserRating] = useState(0); // Стан для рейтингу

  // Можливість вибору рейтингу користувачем
  const handleRating = (newRating) => {
    setUserRating(newRating); // Встановити новий рейтинг
  };

  return (
    <div className='pizza-block'>
      <img
        className='pizza-block__image'
        src={imageUrl}
        alt='Pizza'
      />
      <h4 className='pizza-block__title'>{title}</h4>
      {/* Секція для рейтингу */}
      <div className='pizza-block__rating'>
        {[...Array(totalStars)].map((_, index) => {
          const starIndex = index + 1;
          return (
            <svg
              key={index}
              onClick={() => handleRating(starIndex)} // Якщо хочете, щоб рейтинг оновлювався при кліку
              className={starIndex <= userRating ? "active" : ""}
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill={starIndex <= userRating ? "gold" : "gray"}
              xmlns='http://www.w3.org/2000/svg'
              style={{ cursor: "pointer", marginRight: "5px" }}>
              <path d='M12 .587l3.668 7.426L24 9.75l-6 5.844L19.336 24 12 20.245 4.664 24 6 15.594 0 9.75l8.332-1.737L12 .587z' />
            </svg>
          );
        })}
      </div>
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
              key={i}
              className={indexSize === i ? "active" : ""}
              onClick={() => setIndexsiese(i)}>
              {size} см
            </li>
          ))}
        </ul>
      </div>
      <div className='pizza-block__bottom'>
        <div className='pizza-block__price'> {price} грн</div>
        <button
          className='button button--outline button--add'
          onClick={() => {
            setCount(count + 1);
            onSetButon(price);
          }}
          // onAdSum={() => onSetButon(setCount(count + 1))}
        >
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
          <span> Додати</span>
          <i>{count}</i>
        </button>
      </div>
    </div>
  );
}

export default PizzaBlock;
