import React from "react";
import { useEffect, useState } from "react";
import Categories from "../../cmponents/Categories";
import Sort from "../../cmponents/Sort";
import PizzaBlock from "../../cmponents/PizzaBlock";
import { Skeleton } from "../../cmponents/PizzaBlock/Skeleton";
// import pizzas from "./assets/db.json";

// console.log(pizass);
// https://657c2de4853beeefdb98d6e9.mockapi.io/items      --дані  з МокАПІ
// https://mockapi.io/projects/657c2de4853beeefdb98d6ea

// rsf
function HomePage() {
  const [pizzas, setItems] = useState([]);
  const [isloading, setLoudet] = useState(true);

  const [activeCategori, setactiveCategori] = useState(0);
  const [popapAcktive, setPopapAcktive] = useState({
    name: "популярності",
    sortProperty: "rating",
    sort: "desc",
  });
  // const category = activeCategori !== 0 ? `category=${activeCategori}` : "";
  useEffect(() => {
    setLoudet(true);
    fetch(
      ` https://657c2de4853beeefdb98d6e9.mockapi.io/items?${
        activeCategori !== 0 ? `category=${activeCategori}` : ""
      }&sortBy=${popapAcktive.sortProperty}&order=${popapAcktive.sort}}`
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoudet(false);
      });
  }, [activeCategori, popapAcktive]);

  return (
    <>
      <div className='content__top'>
        <Categories
          value={activeCategori}
          onChangCategori={(id) => setactiveCategori(id)}
        />
        <Sort
          value={popapAcktive}
          onChengPopap={(i) => setPopapAcktive(i)}
        />
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
    </>
  );
}

// rsf
export default HomePage;
