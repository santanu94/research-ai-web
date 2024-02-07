import React from "react";
import "./SearchResults.css";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const SearchResults = ({ results, onClose, additionalClassName }) => {
  const navigate = useNavigate();

  const handleResultClick = (id) => {
    navigate(`/paper/${id}`);
  };
  return (
    <div className={`search-results-overlay ${additionalClassName}`}>
      <div className="search-results-container">
        <IoClose onClick={onClose} className="close-btn" />
        <span className="search-headline">Research papers</span>
        <div className="underline"></div>
        <div className="result-display-area">
          {results.map((result, index) => (
            <div
              key={index}
              className="result-item"
              onClick={() =>
                handleResultClick(
                  result.link.replace("http://arxiv.org/abs/", "")
                  // result.title
                )
              }
            >
              <div className="result-title">{result.title}</div>
              <div className="result-author">
                {result.authors.map((author) => author.trim()).join(", ")}
              </div>
              <div className="result-author">Published on - {result.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
