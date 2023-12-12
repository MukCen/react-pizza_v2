import React from "react";
import "./scss/libs/app.scss";
import Header from "./cmponents/Header";
import Categories from "./cmponents/Categories";
import Sort from "./cmponents/Sort";
import PizzaBlock from "./cmponents/PizzaBlock";

function App() {
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
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
        <PizzaBlock />
      </div>
    </div>
  );
}

export default App;
