import React, { useState } from "react";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const SearchResults = ({
  isFetchingPapers,
  searchFailed,
  results,
  searchId,
  onClose,
  currentPage,
  setCurrentPage,
  additionalClassName,
}) => {
  const navigate = useNavigate();
  const resultsPerPage = 10;

  const handleResultClick = (id, paperTitle, paperPublishedDate, pdfUrl) => {
    posthog.capture("open_paper", { paper_id: id, search_id: searchId });
    mixpanel.track("Clicked to Open Paper");
    navigate(`/paper/${id}`, {
      state: {
        paperTitle,
        paperPublishedDate,
        pdfUrl,
        referrer: "searchResults",
      },
    });
  };

  // Calculate the current results
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = results.slice(indexOfFirstResult, indexOfLastResult);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`search-results-overlay ${additionalClassName}`}>
      <div className="search-results-container">
        <IoClose onClick={onClose} className="close-btn" />
        <span className="search-headline">Research papers</span>
        <div className="underline"></div>
        {currentResults.length > 0 ? (
          <div className="result-display-area">
            {currentResults.map((result, index) => (
              <div
                key={index}
                className={`result-item ${
                  result.url === "" || isFetchingPapers ? "disabled" : ""
                }`}
                onClick={() =>
                  handleResultClick(
                    result.id,
                    result.title,
                    result.published,
                    result.url
                  )
                }
              >
                <div className="result-title">
                  {result.title}
                  {result.url === "" && (
                    <span className="pdf-not-found">[ PDF not found ]</span>
                  )}
                </div>
                <div className="result-author">{result.authors}</div>
                {result.published && (
                  <div className="result-author">
                    Published on - {result.published}
                  </div>
                )}
                <div className="result-topics">
                  {result.topics &&
                    result.topics.split(",").map(
                      (topic, idx) =>
                        topic.trim() && (
                          <span key={idx} className="topic-tag">
                            {topic.trim()}
                          </span>
                        )
                    )}
                </div>
              </div>
            ))}
          </div>
        ) : searchFailed || (results.length === 0 && !isFetchingPapers) ? (
          <div className="d-flex align-items-center justify-content-center flex-column vh-50">
            <div className="error-text">
              No results found or an unexpected error occurred.
            </div>
          </div>
        ) : null}
        {/* Pagination Control */}
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-center">
            {results.length > resultsPerPage && (
              <div className="pagination">
                <li
                  class="page-item"
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                >
                  <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </a>
                </li>
                {Array.from(
                  { length: Math.ceil(results.length / resultsPerPage) },
                  (_, i) => i + 1
                ).map((number) => (
                  <li
                    className={`page-item ${
                      number === currentPage ? "active" : ""
                    }`}
                    onClick={() => paginate(number)}
                  >
                    <a className="page-link" href="#">
                      {number}
                    </a>
                  </li>
                ))}
                <li
                  class="page-item"
                  onClick={() =>
                    paginate(
                      Math.min(
                        currentPage + 1,
                        Math.ceil(results.length / resultsPerPage)
                      )
                    )
                  }
                >
                  <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </a>
                </li>
              </div>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SearchResults;
