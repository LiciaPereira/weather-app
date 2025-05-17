import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { searchCitiesByName } from "../services/weatherService";
import { formatLocationWithAbbr } from "../utils/locationFormat";

export default function SearchBar({
  searchedText,
  setSearchedText,
  handleSearch,
  handleKeyPress,
  handleLocationSelect,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchedText.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await searchCitiesByName(searchedText);
        setSuggestions(cities);
        setShowSuggestions(cities.length > 0);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    //debounce the API call
    const timerId = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchedText]);

  //handle clicks outside the suggestions dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    handleLocationSelect(suggestion);
    setSearchedText("");
    setShowSuggestions(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchedText.trim() !== "") {
      handleSearch(e);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <form
      className="search-bar"
      onSubmit={handleFormSubmit}
      role="search"
      aria-label="City Search"
    >
      <div className="search-input-wrapper" ref={inputRef}>
        <input
          type="search"
          placeholder="Search city (e.g., London or Paris,FR)..."
          value={searchedText}
          onChange={(e) => setSearchedText(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleInputFocus}
          aria-label="Search for a city"
          title="Enter city name in English. You can add country code after comma for more specific results (e.g., London,UK)"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div className="search-suggestions" ref={suggestionsRef}>
            <ul>
              {" "}
              {suggestions.map((suggestion) => {
                //format the display name with state abbreviation using our utility
                let displayText = formatLocationWithAbbr(suggestion);

                //add country if available
                if (
                  suggestion.country &&
                  !displayText.includes(suggestion.country)
                ) {
                  displayText += `, ${suggestion.country}`;
                }

                return (
                  <li
                    key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="location-icon"
                    />
                    <span>{displayText}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isLoading && (
          <div className="search-loading">
            <span>Loading...</span>
          </div>
        )}
      </div>
      <button type="submit" aria-label="Search" className="search-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}
