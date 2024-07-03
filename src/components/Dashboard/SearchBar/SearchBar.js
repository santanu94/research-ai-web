import React, { useState } from "react";
import "./SearchBar.css";
import { IoSearch } from "react-icons/io5";
import { arxiv_search } from "../../../utils/arxiv";
import { v4 as uuidv4 } from "uuid";
import posthog from "posthog-js";
import mixpanel from "mixpanel-browser";

const SearchBar = ({
  setSearchResults,
  setSearchId,
  setSearchQuery,
  setSearchMode,
  searchQuery,
  searchMode,
  setIsFetchingPapers,
  isFetchingPapers,
  setSearchFailed,
  setCurrentPage,
  additionalClassName,
}) => {
  const [searchField, setSearchField] = useState("title");
  const quickSearchOptions = [
    "Llama 3",
    "RAG",
    "LLM Planning",
    "Depth Estimation",
    "Text-to-Image",
    "Multimodal Models",
  ];

  const handleQuickSearch = async (searchOption) => {
    mixpanel.track("Searched Paper with Quick Search");
    const quickSearchTerm = `Latest papers on ${searchOption}`;
    setSearchQuery(quickSearchTerm);
    await performSearch(quickSearchTerm);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const performSearch = async (searchQuery) => {
    console.log(searchQuery);
    if (!searchQuery) return;

    const searchId = uuidv4();
    posthog.capture("search_paper", {
      page: "dashboard",
      search_id: searchId,
      search_mode: searchMode,
    });
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
          body: JSON.stringify({
            search_id: searchId,
            query: searchQuery,
            search_mode: searchMode,
          }),
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
            setCurrentPage(1);
          }
        })
        .catch((error) => {
          // Handle network error
          console.error("Network error:", error);
          setSearchResults([]);
          setSearchFailed(true);
        });
    } catch (error) {
      console.error("Search error:", error); // Handle search error
      setSearchResults([]);
      setSearchFailed(true);
    } finally {
      setIsFetchingPapers(false);
    }
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === "Enter") {
      performSearch(searchQuery);
    }
  };

  const toggleSearchMode = () => {
    setSearchMode((prevMode) => (prevMode === "latest" ? "scholar" : "latest"));
    mixpanel.track("Changed Search Mode");
  };

  return (
    <div className={`${additionalClassName} bg-grey`}>
      <div className="flex-row search-bar-container">
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
          placeholder="Search latest research papers by name or topic."
          onChange={handleSearchChange}
          onKeyPress={handleSearchKeyPress}
          value={searchQuery}
          maxLength={255}
        />
        <div
          className="search-icon d-flex align-items-center flex-shrink-1"
          onClick={() => performSearch(searchQuery)}
        >
          {isFetchingPapers ? (
            <div className="spinner spinner-grow" role="status"></div>
          ) : (
            <IoSearch />
          )}
        </div>
      </div>
      <div className="flex-row quick-search-container">
        <div class="align-self-center px-2">Popular Topics :</div>
        {quickSearchOptions.map((searchOption, index) => (
          <div
            key={index}
            className="quick-search-bubble"
            onClick={() => handleQuickSearch(searchOption)}
          >
            {searchOption}
          </div>
        ))}
      </div>

      {/* <div className="toggle-switch">
        <span className={`label ${searchMode === "latest" ? "active" : ""}`}>
          Latest
        </span>
        <label className="switch">
          <input
            className="toggle-input"
            type="checkbox"
            checked={searchMode === "original"}
            onChange={toggleSearchMode}
          />
          <span className="slider round"></span>
        </label>
        <span className={`label ${searchMode === "original" ? "active" : ""}`}>
          Original
        </span>
      </div> */}
      <div className="toggle-switch">
        <span className={`label ${searchMode === "latest" ? "active" : ""}`}>
          Latest
        </span>
        <label className="switch">
          <input
            className="toggle-input"
            type="checkbox"
            checked={searchMode === "scholar"}
            latest
            onChange={toggleSearchMode}
          />
          <span className="slider round"></span>
        </label>
        <span className={`label ${searchMode === "scholar" ? "active" : ""}`}>
          Scholar
        </span>
      </div>

      {/* <div className="switch-labels">
        <span className={searchMode === "latest" ? "active" : ""}>Latest</span>
        <span className={searchMode === "original" ? "active" : ""}>
          Original
        </span>
      </div> */}
    </div>
  );
};

export default SearchBar;
