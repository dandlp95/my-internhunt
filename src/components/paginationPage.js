import React, { useState } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import "./paginationPage.css";

const PaginationPage = (props) => {
  const [activeButton, setActiveButton] = useState();
  const pageLinks = [];
  const { currentPage, pages } = props;

  let start = currentPage - (currentPage % 10);
  if (start <= 0) start = 1;
  for (let i = start; i <= start + 11 && i <= pages; i++) {
    pageLinks.push(
      <PaginationItem active={currentPage === i}>
        <PaginationLink
          onClick={() => {
            props.nextPage(i);
            setActiveButton(i);
          }}
          className={activeButton === i ? "active-page" : ""}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <Pagination aria-label="Page navigation example" className="paginationcss">
      {currentPage > 100 && (
        <PaginationItem>
          <PaginationLink
            className="addbuttons"
            onClick={() => props.hundreadChange(currentPage, -1)}
          >
            - 100
          </PaginationLink>
        </PaginationItem>
      )}
      {currentPage > 10 && (
        <PaginationItem>
          <PaginationLink
            className="addbuttons"
            onClick={() => {
              props.tenChange(currentPage, -1);
            }}
          >
            - 10
          </PaginationLink>
        </PaginationItem>
      )}
      {pageLinks}
      {currentPage + 10 < pages && (
        <PaginationItem>
          <PaginationLink
            className="addbuttons"
            onClick={() => props.tenChange(currentPage, 1)}
          >
            + 10
          </PaginationLink>
        </PaginationItem>
      )}
      {currentPage + 100 < pages && (
        <PaginationItem>
          <PaginationLink
            className="addbuttons"
            onClick={() => props.hundreadChange(currentPage, 1)}
          >
            + 100
          </PaginationLink>
        </PaginationItem>
      )}
    </Pagination>
  );
};
export default PaginationPage;
