import React from "react";
import PropTypes from "prop-types";

import { DOTS, usePagination } from "./usePagination";
import { Select } from "../index";
import { recordsPerPage } from "./../../../../src/utils/constants";

const Pagination = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
    handlePerPage,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // if (currentPage === 0 || paginationRange.length < 2) {
  //   return (
  //     <div className="row align-items-center">
  //       <div className="col-md-6 col-12 d-flex">
  //         <span className="align-self-center mx-3 font-red">Per Page:</span>
  //         <Select
  //           options={recordsPerPage}
  //           name="perPage"
  //           value={pageSize}
  //           onChange={handlePerPage}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className="row align-items-center mt-3">
      <div className="col-md-6 col-12 d-flex">
        {/* <span className="align-self-center mx-3 font-red">Per Page:</span>
        <Select
          options={recordsPerPage}
          name="perPage"
          value={pageSize}
          onChange={handlePerPage}
        /> */}
      </div>
      <div className="col-md-6 col-12">
        <ul className={`pagination-container mb-0 ${className}`}>
          <li
            className={`pagination-item ${currentPage === 1 ? "disabled" : ""}`}
            onClick={onPrevious}
          >
            <div className="arrow left" />
          </li>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <li className="pagination-item dots" key={index}>
                  &#8230;
                </li>
              );
            }

            return (
              <div key={index}>
                <li
                  className={`pagination-item ${
                    pageNumber === currentPage ? "selected" : ""
                  }`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </li>
              </div>
            );
          })}
          <li
            className={`pagination-item ${
              currentPage === lastPage ? "disabled" : ""
            }`}
            onClick={onNext}
          >
            <div className="arrow right" />
          </li>
        </ul>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  onPageChange: PropTypes.func,
  totalCount: PropTypes.number,
  siblingCount: PropTypes.number,
  currentPage: PropTypes.number,
  pageSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  handlePerPage: PropTypes.func,
};

export default Pagination;
