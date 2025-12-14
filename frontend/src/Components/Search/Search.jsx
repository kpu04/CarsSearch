import { useState, useEffect } from "react";
import "./Search.css";

const Search = ({
  searchValue = "",
  onChange,
  placeholder = "Search...",
  onSearch,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(searchValue);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setLocalValue(searchValue);
  }, [searchValue]);

  const handleChange = (event) => {
    const value = event.target.value;
    setLocalValue(value);

    if (onChange && typeof onChange === "function") {
      onChange(value);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && onSearch) {
      onSearch(localValue);
    }

    if (event.key === "Escape") {
      setLocalValue("");
      if (onChange) onChange("");
      event.target.blur();
    }
  };

  const handleClear = () => {
    setLocalValue("");
    if (onChange) onChange("");
  };

  return (
    <div className={`search-container ${isFocused ? "focused" : ""}`}>
      <div className="search-icon-wrapper">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <input
        className="search-input"
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-label="search"
        autoFocus={autoFocus}
      />

      {localValue && (
        <button
          className="search-clear"
          onClick={handleClear}
          aria-label="Clear search"
          type="button"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Search;
