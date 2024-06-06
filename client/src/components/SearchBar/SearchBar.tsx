import React, { useState } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={input}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar; 