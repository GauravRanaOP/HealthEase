import PropTypes from "prop-types";

// pagination component for view bookings
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // generate page numbers
  const generatePageNumbers = () => {
    let startPage, endPage;
    // display all pages if total pages is less than or equal to 3
    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      // display 3 pages before and after current page
      if (currentPage <= 2) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }
    return [...Array(endPage - startPage + 1)].map(
      (_, index) => startPage + index
    );
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        Previous
      </button>
      {generatePageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={currentPage === pageNumber ? "active" : ""}
          aria-label={`Go to page ${pageNumber}`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

// prop types for pagination component
Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
