import React from "react";

import ReactPaginate from "react-paginate";

import styles from "./Pagination.module.scss";
// Invoke when user click to request another page.
// const handlePageClick = (event) => {
//   const newOffset = (event.selected * itemsPerPage) % items.length;
//   console.log(
//     `User requested page number ${event.selected}, which is offset ${newOffset}`
//   );
//   setItemOffset(newOffset);
// };
///////
const Pagination = ({ onChengPage }) => {
  const handlePageClick = (event) => {
    const newOffset = event.selected;
    onChengPage(newOffset);
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
  };
  return (
    <ReactPaginate
      className={styles.root}
      breakLabel='...'
      nextLabel='>'
      onPageChange={handlePageClick}
      pageRangeDisplayed={8}
      pageCount={7}
      previousLabel='<'
      renderOnZeroPageCount={null}
    />
  );
};

export default Pagination;
