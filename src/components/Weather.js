import React, { useState, useEffect } from "react";
import useWeatherAPI from "../hooks/WeatherAPI";
import getBackgroundMedia from "../utils/weatherBackground";
import { getLocationByCoords } from "../services/weatherService";
import {
  getSearchHistory,
  addToSearchHistory,
  removeFromSearchHistory,
} from "../utils/localStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import "../style/weather.scss";
import ColorTheme, { getCurrentTheme } from "./ColorTheme";
import FutureForecast from "./FutureForecast.js";

export default function Weather() {
  const [city, setCity] = useState("");
  const [searchedText, setSearchedText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(getCurrentTheme() === "dark");
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("metric");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  const {
    temperature,
    weathericon,
    humidity,
    feelsLike,
    windSpeed,
    weatherCondition,
    isLoading,
    error,
  } = useWeatherAPI(city, selectedUnit);

  useEffect(() => {
    ColorTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

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

              if (locationData?.name) {
                setCity(locationData.name);
                // Add to search history
                const newHistory = addToSearchHistory(locationData.name);
                setSearchHistory(newHistory);
              }
            } catch (error) {
              console.error("Error getting location:", error);
              // Fallback to default city if there's an error
              setCity("Jundiai");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            // Fallback to default city if user denies location access
            setCity("Jundiai");
          }
        );
      } else {
        console.log("Geolocation is not supported");
        setCity("Jundiai");
      }
    };

    getUserLocation();
  }, [isInitialLoad]); // Only check on initial load

  useEffect(() => {
    // Update background when weather condition changes
    if (weatherCondition) {
      console.log("Weather condition changed to:", weatherCondition);
      const { backgroundVideo, altText } = getBackgroundMedia(weatherCondition);
      setBackgroundMedia({ backgroundVideo, altText });
    }
  }, [weatherCondition]); // Only depend on weatherCondition

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchedText.trim() !== "") {
      setCity(searchedText);
      const newHistory = addToSearchHistory(searchedText);
      setSearchHistory(newHistory);
      setSearchedText("");
    }
  };

  const handleHistoryClick = (historyCity) => {
    setCity(historyCity);
    const newHistory = addToSearchHistory(historyCity);
    setSearchHistory(newHistory);
  };

  const handleDeleteFromHistory = (e, cityToDelete) => {
    e.stopPropagation(); // Prevent triggering the history item click
    const newHistory = removeFromSearchHistory(cityToDelete);
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
        <source src={backgroundMedia.backgroundVideo} type="video/mp4" />
        <track kind="captions" />
      </video>
      <section className="todays-info" aria-label="Today's Weather">
        <h1 className="weather-app-name">Weather Dashboard</h1>
        {error ? (
          <div className="error-message" role="alert">
            {error}
          </div>
        ) : isLoading ? (
          <div className="loading" role="status">
            Loading weather data...
          </div>
        ) : (
          <>
            <div className="current-city-info">
              <div className="cur-temperature" aria-label="Current Temperature">
                {temperature ? `${temperature}${getUnitSymbol()}` : "18°C"}
              </div>
              <div className="divider" aria-hidden="true">
                |
              </div>
              <div className="cur-city" aria-label="Current City">
                {city || "Jundiai"}
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
          </>
        )}
      </section>
      <section className="more-info" aria-label="Search">
        <div className="search-container">
          <SearchBar
            searchedText={searchedText}
            setSearchedText={setSearchedText}
            handleSearch={handleSearch}
            handleKeyPress={handleKeyPress}
            selectedUnit={selectedUnit}
            setSelectedUnit={setSelectedUnit}
          />
        </div>

        {/* Only show search history on desktop screens */}
        {window.innerWidth > 1024 && searchHistory.length > 0 && (
          <div className="search-history-list">
            <h2 className="history-title">Recent Searches</h2>
            <div className="history-grid">
              {searchHistory.map((historyCity, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(historyCity)}
                  aria-label={`Search for ${historyCity}`}
                >
                  <span className="history-city">{historyCity}</span>
                  <button
                    className="delete-history"
                    onClick={(e) => handleDeleteFromHistory(e, historyCity)}
                    aria-label={`Remove ${historyCity} from history`}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>{" "}
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
      </div>
    </main>
  );
}
