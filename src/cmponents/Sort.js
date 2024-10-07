import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Popup from "./Popup"; // Виносимо попап в окремий компонент
import { CSSTransition } from "react-transition-group"; // Для анімацій

function Sort({ value, onChengPopap }) {
  const sortRef = useRef(null);
  const [visiblePopap, setVisiblePopap] = useState(false);

  // Мемоізація масиву сортування
  const sortPopaps = useMemo(
    () => [
      { name: "популярності", sortProperty: "rating desc", sort: "desc" },
      { name: "популярності", sortProperty: "rating asc", sort: "asc" },
      { name: "ціні", sortProperty: "price desc", sort: "desc" },
      { name: "ціні", sortProperty: "price asc", sort: "asc" },
      { name: "алфавіту", sortProperty: "title desc", sort: "desc" },
      { name: "алфавіту", sortProperty: "title asc", sort: "asc" },
    ],
    []
  );

  // Меморизована функція для обробки кліку
  const handlePopapAcktive = useCallback(
    (popap) => {
      onChengPopap(popap);
      setVisiblePopap(false); // Закриваємо попап після вибору сортування
    },
    [onChengPopap]
  );

  // Функція для закриття попапа при кліку поза ним
  const handleClickOutside = useCallback((event) => {
    if (sortRef.current && !event.composedPath().includes(sortRef.current)) {
      setVisiblePopap(false);
    }
  }, []);

  // Ефект для обробки кліків поза попапом
  useEffect(() => {
    if (visiblePopap) {
      document.body.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [visiblePopap, handleClickOutside]);

  return (
    <div
      ref={sortRef}
      className='sort'>
      <div className='sort__label'>
        <svg
          width='10'
          height='6'
          viewBox='0 0 10 6'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z'
            fill='#2C2C2C'
          />
        </svg>
        <b>Сортування по:</b>
        <span onClick={() => setVisiblePopap(!visiblePopap)}>
          {value.name + " " + value.sort}
        </span>
      </div>

      {/* Використовуємо анімації для плавного відкриття та закриття попапа */}
      <CSSTransition
        in={visiblePopap}
        timeout={300}
        classNames='popup'
        unmountOnExit>
        <Popup
          items={sortPopaps}
          value={value}
          onItemClick={handlePopapAcktive}
        />
      </CSSTransition>
    </div>
  );
}

export default Sort;

// import { useEffect, useRef, useState } from "react";

// function Sort({ value, onChengPopap }) {
//   const sortRef = useRef(null);
//   console.log(sortRef);
//   const [visiblePopap, setVisiblePopap] = useState(false);

//   const sortPopaps = [
//     { name: "популярності", sortProperty: "rating desc", sort: "desc" },
//     { name: "популярності", sortProperty: "rating asc", sort: "asc" },
//     { name: "ціні", sortProperty: "price desc", sort: "desc" },
//     { name: "ціні", sortProperty: "price asc", sort: "asc" },
//     { name: "алфавіту", sortProperty: "title desc", sort: "desc" },
//     { name: "алфавіту", sortProperty: "title asc", sort: "asc" },
//   ];

//   const handlePopapAcktive = (popap) => {
//     onChengPopap(popap);
//     setVisiblePopap(false);
//   };

//   return (
//     <div
//     ref={sortRef}
//     className='sort'>
//       <div className='sort__label'>
//         <svg
//           width='10'
//           height='6'
//           viewBox='0 0 10 6'
//           fill='none'
//           xmlns='http://www.w3.org/2000/svg'>
//           <path
//             d='M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z'
//             fill='#2C2C2C'
//             />
//         </svg>
//         <b>Сортування по:</b>
//         <span onClick={() => setVisiblePopap(!visiblePopap)}>
//           {value.name + " " + value.sort}
//         </span>
//       </div>
//       {visiblePopap ? (
//         <div className='sort__popup'>
//           <ul>
//             {sortPopaps.map((popap, i) => (
//               <li
//               key={i}
//               onClick={() => handlePopapAcktive(popap)}
//               className={
//                 value.sortProperty === popap.sortProperty ? "active" : ""
//               }>
//                 {popap.name + " " + popap.sort}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         ""
//         )}
//     </div>
//   );
// }
// export default Sort;

// useEffect(() => {
//   const eventsPopap = (event) => {
//     const _event = event || {};
//     if (
//       sortRef.current &&
//       (!_event.path || !_event.path.includes(sortRef.current))
//     ) {
//       // console.log(sortRef.current);
//       // console.log(_event.path);
//       setVisiblePopap(false);
//     }
//   };

//   document.body.addEventListener("click", eventsPopap);
//   return () => document.body.removeEventListener("click", eventsPopap);
// }, []);
