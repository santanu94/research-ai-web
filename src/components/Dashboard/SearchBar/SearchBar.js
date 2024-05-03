import React, { useState } from "react";
import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";
import { arxiv_search } from "../../../utils/arxiv";
import { v4 as uuidv4 } from "uuid";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const SearchBar = ({ setSearchResults, setSearchId, additionalClassName }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [isFetchingPapers, setIsFetchingPapers] = useState(false);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = async () => {
    const searchId = uuidv4();
    posthog.capture("search_paper", { page: "dashboard", search_id: searchId });
    mixpanel.track("Searched Paper");
    try {
      setIsFetchingPapers(true);
      // const results = await arxiv_search({ [searchField]: searchTerm });

      var search_results = [];
      await fetch(
        `${process.env.REACT_APP_SEARCH_DOMAIN}${process.env.REACT_APP_SEARCH_ENDPOINT}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search_id: searchId, query: searchTerm }),
        }
      )
        .then((response) => {
          if (!response.ok) {
            // Handle response error
            console.error("search failed");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          if (data["search_id"] === searchId) {
            search_results = data["result"];
            setSearchId(searchId);
            setSearchResults(search_results);
          }
        })
        .catch((error) => {
          // Handle network error
          console.error("Network error:", error);
        });
    } catch (error) {
      console.error("Search error:", error); // Handle search error
    } finally {
      setIsFetchingPapers(false);
    }
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  };

  return (
    <div className={`search-bar-container ${additionalClassName}`}>
      {/* <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className="search-field-selector text-center"
      >
        <option value="author">Author</option>
        <option value="title">Title</option>
        <option value="abstrct">Abstract</option>
        <option value="all">All</option>
      </select> */}
      <input
        className="search-bar"
        type="text"
        // placeholder="Search research papers, authors or conferences"
        placeholder="Search research paper by name or topic, e.g. 'latest rag papers', 'lima paper', ..."
        onChange={handleSearchChange}
        onKeyPress={handleSearchKeyPress}
        value={searchTerm}
        maxLength={255}
      />
      <div
        className="search-icon d-flex align-items-center flex-shrink-1"
        onClick={performSearch}
      >
        {isFetchingPapers ? (
          <div className="spinner spinner-grow" role="status"></div>
        ) : (
          <IoSearch />
        )}
      </div>
    </div>
  );
};

export default SearchBar;
