import React, { useState } from 'react';
import './SearchBar.css';

// Define the SearchQuery type if not already defined
interface SearchQuery {
  name: string;
  city: string;
  state: string;
  date: Date | null;
}

interface SearchBarProps {
  placeholder: string;
  onSearch: React.Dispatch<React.SetStateAction<SearchQuery>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    onSearch(prev => ({
      ...prev,
      name: name,
      city: city,
      state: state,
      date: date ? new Date(date) : null  // Ensure the date is either a Date object or null
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parts = e.target.value.split(',').map(part => part.trim());
    if (parts.length === 1) {
      setCity(parts[0]);
      setState('');
    } else if (parts.length > 1) {
      setCity(parts[0]);
      setState(parts[1] || '');  // Ensure state is empty string if not defined
    }
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-bar-input"
        placeholder="Service"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        className="search-bar-input"
        placeholder="Location City"
        value={`${city}${state ? ', ' + state : ''}`}
        onChange={handleLocationChange}
      />
      <input
        type="date"
        className="search-bar-input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>  
    </div>
  );
};

export default SearchBar;
