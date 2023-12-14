import React from "react";
import "./scss/libs/app.scss";
import Header from "./cmponents/Header";
import Categories from "./cmponents/Categories";
import Sort from "./cmponents/Sort";
import PizzaBlock from "./cmponents/PizzaBlock";
import pizass from "./assets/db.json";

console.log(pizass);

function App() {
  // 2 варіант
  // const pizass = [
  //   {
  //     id: 0,
  //     imageUrl:
  //       "https://dodopizza.azureedge.net/static/Img/Products/f035c7f46c0844069722f2bb3ee9f113_584x584.jpeg",
  //     title: "Пепперони Фреш с перцем",
  //     types: [0, 1],
  //     sizes: [26, 30, 40],
  //     price: 803,
  //     category: 0,
  //     rating: 4,
  //   },
  // ];
  return (
    <div className='wrapper'>
      <Header />
      <div className='content'>
        <div className='container'>
          <div className='content__top'>
            <Categories />
            <Sort />
          </div>
        </div>
      </div>
      <h2 className='content__title'>Все пиццы</h2>
      <div className='content__items'>
        {pizass.map((obj, i) => (
          <PizzaBlock
            title={obj.title}
            price={obj.price}
            image={obj.imageUrl}
            sizes={obj.sizes}
            types={obj.types}
            key={i}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
