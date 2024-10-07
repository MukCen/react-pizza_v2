function Popup({ items, value, onItemClick }) {
  return (
    <div className='sort__popup'>
      <ul>
        {items.map((item, i) => (
          <li
            key={i}
            onClick={() => onItemClick(item)}
            className={
              value.sortProperty === item.sortProperty ? "active" : ""
            }>
            {item.name + " " + item.sort}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Popup;
