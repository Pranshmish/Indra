import { createContext, useContext, useState } from 'react';

const SearchLocation = createContext();

export const useSearchLocation = () => useContext(SearchLocation);

export const SearchLocationProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchLocation.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchLocation.Provider>
  );
};


