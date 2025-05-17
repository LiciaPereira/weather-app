import React, { useState, useEffect, useCallback } from "react";
import useWeatherAPI from "../hooks/WeatherAPI";
import getBackgroundMedia from "../utils/weatherBackground";
import {
  getLocationByCoords,
  searchCitiesByName,
} from "../services/weatherService";
import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
} from "../utils/localStorage";
import { formatLocationWithAbbr } from "../utils/locationFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import "../style/weather.scss";
import ColorTheme, { getCurrentTheme } from "./ColorTheme";
import FutureForecast from "./FutureForecast.js";

export default function Weather() {
  const DEFAULT_CITY = "Jundiai";

  const [city, setCity] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(getCurrentTheme() === "dark");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("metric");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getUnitSymbol = () => {
    switch (selectedUnit) {
      case "imperial":
        return "°F";
      case "standard":
        return "K";
      default:
        return "°C";
    }
  };
  const [backgroundMedia, setBackgroundMedia] = useState({
    backgroundVideo: "/videos/clear-sky.mp4",
    altText: "Time lapse of a clear blue sky with white clouds",
  });

  //memoize the error handler to prevent unnecessary re-renders
  const handleWeatherError = useCallback((errorMsg) => {
    //when an error occurs, set the error message and show the popup
    setErrorMessage(errorMsg);
    setShowErrorPopup(true);
  }, []);

  const {
    temperature,
    weathericon,
    humidity,
    feelsLike,
    windSpeed,
    weatherCondition,
    isLoading,
  } = useWeatherAPI(city, selectedUnit, handleWeatherError);

  useEffect(() => {
    ColorTheme(isDarkMode);
  }, [isDarkMode]);
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);
  //handle ESC key to close error popup
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && showErrorPopup) {
        handleCloseErrorPopup();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [showErrorPopup]);
  //function to handle closing the error popup with animation
  const handleCloseErrorPopup = () => {
    const overlay = document.querySelector(".error-popup-overlay");
    if (overlay) {
      overlay.classList.add("error-popup-closing");
      //wait for animation to finish before removing from DOM
      setTimeout(() => {
        setShowErrorPopup(false);
        //also clear the error message to prevent it from showing again
        setErrorMessage(null);
      }, 300);
    } else {
      setShowErrorPopup(false);
      setErrorMessage(null);
    }
  };

  useEffect(() => {
    // Get user's location only on initial load
    const getUserLocation = async () => {
      if (!isInitialLoad) return;
      setIsInitialLoad(false);

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const locationData = await getLocationByCoords(
                latitude,
                longitude
              );
              if (locationData) {
                // format displayName with abbreviated state/province
                const displayName = formatLocationWithAbbr(locationData);
                locationData.displayName = displayName;

                setCity(displayName);
                //add to search history with all location details
                const newHistory = addToSearchHistory(locationData);
                setSearchHistory(newHistory);

                //store the full location data for the WeatherAPI
                localStorage.setItem(
                  "lastSelectedLocation",
                  JSON.stringify(locationData)
                );
              }
            } catch (error) {
              console.error("Error getting location:", error);
              //display a helpful message before falling back
              alert(
                "Could not determine your location. Showing default city weather instead."
              );
              //fallback to default city if there's an error
              setCity(DEFAULT_CITY);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);

            // provide helpful message based on specific geolocation errors
            let errorMsg =
              "Location access unavailable. Showing default city weather instead.";

            if (error.code === 1) {
              errorMsg =
                "Location permission denied. Please enable location access in your browser settings to use automatic location detection.";
            } else if (error.code === 2) {
              errorMsg =
                "Your location could not be determined. Check your device's location services.";
            } else if (error.code === 3) {
              errorMsg = "Location request timed out. Please try again later.";
            }

            alert(errorMsg);
            // fallback to default city if user denies location access
            setCity(DEFAULT_CITY);
          }
        );
      } else {
        console.log("Geolocation is not supported");
        setCity(DEFAULT_CITY);
      }
    };

    getUserLocation();
  }, [isInitialLoad]); //only check on initial load

  useEffect(() => {
    // update background when weather condition changes
    if (weatherCondition) {
      console.log("Weather condition changed to:", weatherCondition);
      const { backgroundVideo, altText } = getBackgroundMedia(weatherCondition);
      setBackgroundMedia({ backgroundVideo, altText });
    }
  }, [weatherCondition]); // Only depend on weatherCondition
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (searchedText.trim() !== "") {
      try {
        // close any existing error popup
        setShowErrorPopup(false);

        //get location data from the geocoding API
        const cities = await searchCitiesByName(searchedText, 1); // Limit to 1 result

        if (cities && cities.length > 0) {
          //use the first result
          const locationData = cities[0];
          handleLocationSelect(locationData);
        } else {
          //if no cities found, show error
          handleWeatherError(
            `City "${searchedText}" not found. Try being more specific (e.g., "Worcester, MA" or "Worcester, UK").`
          );
        }
      } catch (error) {
        console.error("Search error:", error);
        handleWeatherError(error.message);
      }

      setSearchedText("");
    }
  };
  const handleLocationSelect = (locationData) => {
    //close any existing error popup
    setShowErrorPopup(false);

    // get formatted display name with state/province abbreviation
    const displayName = formatLocationWithAbbr(locationData);

    //keep the full name for search suggestions and API
    const fullName =
      locationData.displayName ||
      (locationData.state
        ? `${locationData.name}, ${locationData.state}, ${
            locationData.country || ""
          }`
        : `${locationData.name}, ${locationData.country || ""}`);

    //create a search-friendly version of the name
    const searchName = displayName.toLowerCase();

    //create enhanced location object
    const enhancedLocation = {
      ...locationData,
      displayName, //UI display (City, State)
      fullName, //full name with country (City, State, Country)
      searchName, //lowercase for search matching
    };

    //use the enhanced display name for the UI
    setCity(displayName);

    //store in search history with all location details
    const newHistory = addToSearchHistory(enhancedLocation);
    setSearchHistory(newHistory);

    //store the full location data for the WeatherAPI
    localStorage.setItem(
      "lastSelectedLocation",
      JSON.stringify(enhancedLocation)
    );
  };
  const handleHistoryClick = (locationItem) => {
    //close any existing error popup
    setShowErrorPopup(false);

    //handle both string and object formats for backward compatibility
    if (typeof locationItem === "string") {
      setCity(locationItem);
      const newHistory = addToSearchHistory(locationItem);
      setSearchHistory(newHistory);
    } else {
      //format the display name with abbreviated state/province using our utility
      let displayName;

      if (locationItem.displayName) {
        //use existing displayName if it exists (might already be formatted)
        displayName = locationItem.displayName;
      } else {
        //use our common formatting utility
        displayName = formatLocationWithAbbr(locationItem);

        //update the displayName in the location object
        locationItem.displayName = displayName;
      }

      //ese the display name for UI and the coordinates for API accuracy
      setCity(displayName);

      //Store the full location data for the WeatherAPI
      localStorage.setItem(
        "lastSelectedLocation",
        JSON.stringify(locationItem)
      );

      const newHistory = addToSearchHistory(locationItem);
      setSearchHistory(newHistory);
    }
  };

  const handleDeleteFromHistory = (e, locationToDelete) => {
    e.stopPropagation(); // Prevent triggering the history item click
    const newHistory = removeFromSearchHistory(locationToDelete);
    setSearchHistory(newHistory);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    ColorTheme(newDarkMode);
    setIsDarkMode(newDarkMode);
  };

  return (
    <main className={`container ${isDarkMode ? "dark-mode" : ""}`} role="main">
      <video
        key={backgroundMedia.backgroundVideo} // Add key to force video reload
        className="background-video"
        autoPlay
        loop
        muted
        aria-hidden="true"
      >
        {" "}
        <source src={backgroundMedia.backgroundVideo} type="video/mp4" />
        <track kind="captions" />
      </video>
      <section className="todays-info" aria-label="Today's Weather">
        <h1 className="weather-app-name">Weather Dashboard</h1>
        <div className="weather-content">
          {isLoading && (
            <div className="loading-overlay" role="status">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                size="3x"
                className="loading-spinner"
              />
            </div>
          )}
          <div className={`weather-data ${isLoading ? "loading-dim" : ""}`}>
            <div className="current-city-info">
              <div className="cur-temperature" aria-label="Current Temperature">
                {temperature ? `${temperature}${getUnitSymbol()}` : "18°C"}
              </div>
              <div className="divider" aria-hidden="true">
                |
              </div>{" "}
              <div
                className="cur-city"
                aria-label="Current City"
                title={city || DEFAULT_CITY}
              >
                {city || DEFAULT_CITY}
              </div>
              <div className="cur-icon" role="img" aria-label="Weather Icon">
                {weathericon ? (
                  <img
                    src={weathericon}
                    alt={weatherCondition || "Current weather condition"}
                  />
                ) : (
                  <span role="img" aria-label="Sunny">
                    🌤️
                  </span>
                )}
              </div>
            </div>
            <div className="information">
              <div className="more-info-info">
                <div
                  className="cur-feelslike"
                  aria-label="Feels like temperature"
                >
                  {feelsLike ? `${feelsLike}${getUnitSymbol()}` : "15°C"}
                </div>
                <label id="feelslike-label">Feels Like</label>
              </div>
              <div className="more-info-info">
                <div className="cur-humidity" aria-label="Humidity percentage">
                  {humidity ? `${humidity}%` : "70%"}
                </div>
                <label id="humidity-label">Humidity</label>
              </div>
              <div className="more-info-info">
                <div className="cur-wind-speed" aria-label="Wind speed">
                  {windSpeed ? `${windSpeed} km/h` : "10 km/h"}
                </div>
                <label id="windspeed-label">Wind Speed</label>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="more-info" aria-label="Search">
        <div className="search-container">
          {" "}
          <SearchBar
            searchedText={searchedText}
            setSearchedText={setSearchedText}
            handleSearch={handleSearch}
            handleKeyPress={handleKeyPress}
            handleLocationSelect={handleLocationSelect}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
          />
        </div>
        {/* Only show search history on desktop screens */}
        {window.innerWidth > 1024 && searchHistory.length > 0 && (
          <div className="search-history-list">
            <h2 className="history-title">Recent Searches</h2>
            <div className="history-grid">
              {" "}
              {searchHistory.map((historyItem, index) => {
                //handle both string and object formats for backward compatibility
                let displayName;

                if (typeof historyItem === "string") {
                  displayName = historyItem;
                } else if (historyItem.displayName) {
                  displayName = historyItem.displayName;
                } else {
                  //use our common formatting utility
                  displayName = formatLocationWithAbbr(historyItem);
                }

                return (
                  <button
                    key={index}
                    className="history-item"
                    onClick={() => handleHistoryClick(historyItem)}
                    aria-label={`Search for ${displayName}`}
                    title={historyItem.fullName || displayName}
                  >
                    <span
                      className="history-city"
                      title={historyItem.fullName || displayName}
                    >
                      {displayName}
                    </span>
                    <button
                      className="delete-history"
                      onClick={(e) => handleDeleteFromHistory(e, historyItem)}
                      aria-label={`Remove ${displayName} from history`}
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </button>
                );
              })}
            </div>
          </div>
        )}{" "}
      </section>
      <FutureForecast city={city} selectedUnit={selectedUnit} />
      <div className="settings-container">
        <div className="unit-selector">
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="unit-select"
            aria-label="Temperature unit"
          >
            <option value="metric">°C</option>
            <option value="imperial">°F</option>
            <option value="standard">K</option>
          </select>
        </div>
        <div className="color-theme">
          <button
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
            title={
              isDarkMode ? "Switch to light theme" : "Switch to dark theme"
            }
          >
            {isDarkMode ? (
              <span role="img" aria-hidden="true">
                ☀️
              </span>
            ) : (
              <span role="img" aria-hidden="true">
                🌙
              </span>
            )}
          </button>
        </div>
      </div>{" "}
      {/* Error Popup Modal */}
      {showErrorPopup && errorMessage && (
        <div
          className="error-popup-overlay"
          onClick={(e) => {
            // Close when clicking on the overlay (outside the popup)
            if (e.target === e.currentTarget) {
              handleCloseErrorPopup();
            }
          }}
        >
          <div
            className="error-popup"
            role="alertdialog"
            aria-modal="true"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleCloseErrorPopup();
              }
            }}
            tabIndex="-1"
          >
            <div className="error-popup-header">
              <h2>Error</h2>
            </div>

            <div className="error-popup-content">
              <p>{errorMessage}</p>

              {errorMessage.includes("not found") && (
                <div className="error-tips">
                  <p>Some tips:</p>
                  <ul>
                    <li>
                      Make sure to use English city names (e.g., "Munich"
                      instead of "München")
                    </li>
                    <li>
                      For cities with spaces, the name is still valid (e.g.,
                      "New York", "San Francisco")
                    </li>
                    <li>
                      Try adding the country code for more specific results
                      (e.g., "London,UK")
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="error-popup-footer">
              <button
                className="error-close-btn"
                onClick={handleCloseErrorPopup}
                aria-label="Close error message"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCloseErrorPopup();
                  }
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
