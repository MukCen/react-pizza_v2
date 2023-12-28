function Categories({ value, onChangCategori }) {
   console.log(value);
  const categoriItems = [
    "Всі",
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
            className={value === index ? "active" : ""}
            onClick={() => onChangCategori(index)}>
            {categori}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Categories;
