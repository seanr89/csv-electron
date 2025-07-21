
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  headers: string[];
  onSearch: (query: string, column: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ headers, onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedColumn, setSelectedColumn] = useState(headers[0] || '');

  const handleSearch = () => {
    onSearch(query, selectedColumn);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
      <select
        value={selectedColumn}
        onChange={(e) => setSelectedColumn(e.target.value)}
        className="bg-slate-600 text-white rounded-md p-2 h-full"
      >
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Search in ${selectedColumn}...`}
        className="bg-slate-800 text-white w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        onClick={handleSearch}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-2 rounded-lg"
      >
        <SearchIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default SearchBar;
