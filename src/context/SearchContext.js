import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchId, setSearchId] = useState(null);

  return (
    <SearchContext.Provider
      value={{ searchResults, setSearchResults, searchId, setSearchId }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
