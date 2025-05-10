import React, { useState, useEffect } from "react";
import useWeatherAPI from "../hooks/WeatherAPI";
import getBackgroundMedia from "../utils/weatherBackground";
import { getSearchHistory, addToSearchHistory } from "../utils/localStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import "../style/weather.scss";
import ColorTheme, { getCurrentTheme } from "./ColorTheme";
import FutureForecast from "./FutureForecast.js";

export default function Weather() {
  const [city, setCity] = useState("");
  const degrees = "C";
  const [searchedText, setSearchedText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(getCurrentTheme() === "dark");
  const [searchHistory, setSearchHistory] = useState([]);

  const [backgroundMedia, setBackgroundMedia] = useState({
    backgroundVideo: require("../assets/images/blue-sky.mp4"),
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
  } = useWeatherAPI(city);

  useEffect(() => {
    ColorTheme(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    if (weatherCondition) {
      const { backgroundVideo, altText } = getBackgroundMedia(weatherCondition);
      setBackgroundMedia({ backgroundVideo, altText });
    }
  }, [weatherCondition]);

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
        className="background-video"
        autoPlay
        loop
        muted
        aria-hidden="true"
        title={backgroundMedia.altText}
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
                {temperature ? `${temperature}°${degrees}` : "18°C"}
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
                  {feelsLike ? `${feelsLike}°${degrees}` : "15°C"}
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

      <section className="more-info" aria-label="Search and History">
        <div className="search-container">
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
        </div>

        {searchHistory.length > 0 && (
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
                  <FontAwesomeIcon icon={faHistory} className="history-icon" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <FutureForecast city={city} />

      <div className="color-theme">
        <button
          onClick={toggleTheme}
          aria-label={
            isDarkMode ? "Switch to light theme" : "Switch to dark theme"
          }
          title={isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
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
    </main>
  );
}
