import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchId, setSearchId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("latest");

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        searchId,
        setSearchId,
        searchQuery,
        setSearchQuery,
        searchMode,
        setSearchMode,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
