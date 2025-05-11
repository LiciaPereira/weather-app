import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function SearchBar({
  searchedText,
  setSearchedText,
  handleSearch,
  handleKeyPress,
}) {
  return (
    <form
      className="search-bar"
      onSubmit={handleSearch}
      role="search"
      aria-label="City Search"
    >
      <div className="search-input-wrapper">
        <input
          type="search"
          placeholder="Search city..."
          value={searchedText}
          onChange={(e) => setSearchedText(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Search for a city"
        />
      </div>
      <button type="submit" aria-label="Search" className="search-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}
