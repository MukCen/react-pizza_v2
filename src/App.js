import React, { useEffect, useState } from "react";
import "./scss/libs/app.scss";
import Header from "./cmponents/Header";
import Categories from "./cmponents/Categories";
import Sort from "./cmponents/Sort";
import PizzaBlock from "./cmponents/PizzaBlock/index";
import { Skeleton } from "./cmponents/PizzaBlock/Skeleton";
// import pizzas from "./assets/db.json";

// console.log(pizass);
// https://657c2de4853beeefdb98d6e9.mockapi.io/items      --дані  з МокАПІ
// https://mockapi.io/projects/657c2de4853beeefdb98d6ea

function App() {
  const [pizzas, setItems] = useState([]);
  const [isloading, setLoudet] = useState(true);

  useEffect(() => {
    // setLoudet(true);
    fetch(" https://657c2de4853beeefdb98d6e9.mockapi.io/items")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoudet(false);
      });
  }, []);
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
        {isloading
          ? [...new Array(6)].map((_, id) => <Skeleton key={id} />)
          : pizzas.map((obj, i) => (
              <PizzaBlock
                {...obj}
                key={i}
              />
            ))}
      </div>
    </div>
  );
}

export default App;
