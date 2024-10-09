import React from "react";
import { useEffect, useState } from "react";
import Categories from "../../cmponents/Categories";
import Sort from "../../cmponents/Sort";
import PizzaBlock from "../../cmponents/PizzaBlock/PizzaBlock";
import { Skeleton } from "../../cmponents/Skeleton";
import Pagination from "../../cmponents/Pagination";
// import pizzas from "./assets/db.json";

// console.log(pizass);
// https://657c2de4853beeefdb98d6e9.mockapi.io/items      --дані  з МокАПІ
// https://mockapi.io/projects/657c2de4853beeefdb98d6ea

// rsf
function HomePage({ searchValue, setCount }) {
  const [pizzas, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [isloading, setLoudet] = useState(true);

  const [activeCategori, setactiveCategori] = useState(0);
  const [popapAcktive, setPopapAcktive] = useState({
    name: "популярності",
    sortProperty: "rating",
    sort: "desc",
  });
  const category = activeCategori !== 0 ? `&category=${activeCategori}` : "";
  const search = searchValue ? `&search=${searchValue}` : "";
  console.log(page);

  useEffect(() => {
    setLoudet(true);
    fetch(
      `http://localhost:5000/api/pizzas?page=${page}${category}&sort=${popapAcktive.sortProperty}&order=${popapAcktive.sort}${search}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched pizzas:", data); // Додайте цей рядок
        setItems(data);
        setLoudet(false);
      })
      .catch((err) => {
        console.error("Error fetching pizzas:", err);
        setLoudet(false);
      });
  }, [category, popapAcktive, search, page]);

  // useEffect(() => {
  //   setLoudet(true);
  //   fetch(`http://localhost:5000/api/pizzas?page=${page}${category}
  //     &sort=${popapAcktive.sortProperty}&order=${popapAcktive.sort}${

  //       searchValue ? `&search=${searchValue}` : ""
  //     }`)
  // ` https://657c2de4853beeefdb98d6e9.mockapi.io/items?&page=${page}${
  //   activeCategori !== 0 ? `category=${activeCategori}` : ""
  // }&sortBy=${popapAcktive.sortProperty}&order=${popapAcktive.sort}${
  // searchValue ? `&search=${searchValue}` : ""
  // }`
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setItems(data);
  //       setLoudet(false);
  //     });
  // }, [activeCategori, popapAcktive, searchValue, page, category]);

  // Invoke when user click to request another page.
  // const handlePageClick = (event) => {
  //   const newOffset = (event.selected * itemsPerPage) % items.length;
  //   console.log(
  //     `User requested page number ${event.selected}, which is offset ${newOffset}`
  //   );
  //   setItemOffset(newOffset);
  // };

  ///////

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
          : Array.isArray(pizzas) &&
            pizzas.map((obj) => (
              <PizzaBlock
                {...obj}
                key={obj.key}
                onSetButon={setCount}
              />
            ))}
      </div>
      <Pagination
        onChengPage={setPage}
        page={page}
      />
    </>
  );
}

// rsf
export default HomePage;
