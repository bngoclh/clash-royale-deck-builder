`use client`
import React, { useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  onChange,
}) => {
  const [value, setValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <div className="relative flex items-center w-full rounded-md bg-gray-100 px-3 py-2 shadow-sm">
      <svg
        className="absolute right-3 top-3 h-5 w-5 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clipRule="evenodd"
        />
      </svg>
      <input
        type="text"
        className="w-full pl-8 pr-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-indigo-500 focus:ring-opacity-50 text-gray-700"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
