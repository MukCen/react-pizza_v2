import { useState } from "react";

function Categories() {
  const [activeCategori, setactiveCategori] = useState(0);
  const categoriItems = [
    "М'ясні",
    "Вегетаріанські",
    "Гриль",
    "Гострі",
    "Закриті",
  ];

  return (
    <div className='categories'>
      <ul>
        {/* <li className={"active"}>"Мясные"</li> */}
        {categoriItems.map((categori, index) => (
          <li
            key={index}
            className={activeCategori === index ? "active" : ""}
            onClick={() => setactiveCategori(index)}>
            {categori}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
