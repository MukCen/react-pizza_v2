import React from "react";
import "./scss/libs/app.scss";
import Header from "./cmponents/Header";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import CartPage from "./pages/Cart/CartPage";
import NotFound from "./cmponents/notfound";
import { useState } from "react";

// https://skeletonreact.com/
function App() {
  const [searchValue, setSearchValue] = useState("");
  // const setSearchValuInput = (str) => setsearchValue(str);

  return (
    <div className='wrapper'>
      <Header
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <div className='content'>
        <div className='container'>
          <Routes>
            <Route
              path='/'
              element={<HomePage searchValue={searchValue} />}
            />

            <Route
              path='/cart'
              element={<CartPage />}
            />
            <Route
              path='*'
              element={<NotFound />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
