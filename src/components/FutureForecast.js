import React, { useState, useEffect, useRef } from "react";
import { getFiveDayForecast } from "../services/weatherService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function FutureForecast({ city, selectedUnit = "metric" }) {
  const [forecastDays, setForecastDays] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingTimerRef = useRef(null);

  useEffect(() => {
    const week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day = new Date();

    // Generate next 5 days, starting from tomorrow
    let futureDays = [];
    for (let i = 1; i <= 5; i++) {
      const futureDate = new Date(day);
      futureDate.setDate(day.getDate() + i);
      const dayName = week[futureDate.getDay()];
      futureDays.push({
        name: dayName,
        date: futureDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      });
    }

    setForecastDays(futureDays);
  }, []);
  useEffect(() => {
    const fetchForecastData = async () => {
      if (!city) return;

      //clear any existing timer
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }

      //only show loading spinner after 2.5s of loading
      loadingTimerRef.current = setTimeout(() => {
        setLoading(true);
      }, 2500);

      setError(null);
      try {
        //check if we have stored location data with coordinates
        const storedLocationData = localStorage.getItem("lastSelectedLocation");
        let data;

        if (storedLocationData) {
          const locationData = JSON.parse(storedLocationData); // Only use the stored coordinates if they match the current city name
          //handle both old and new location data formats
          const cityMatch =
            locationData.displayName === city ||
            (locationData.name && city.includes(locationData.name));

          if (cityMatch && locationData.lat && locationData.lon) {
            data = await getFiveDayForecast(
              city,
              selectedUnit,
              locationData.lat,
              locationData.lon
            );
          } else {
            data = await getFiveDayForecast(city, selectedUnit);
          }
        } else {
          data = await getFiveDayForecast(city, selectedUnit);
        }

        // Group the forecast data by day
        const dailyData = data.list.reduce((acc, item) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = {
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              weather: item.weather[0],
              wind: item.wind.speed,
              rain: item.pop * 100, // Convert probability to percentage
            };
          } else {
            acc[date].temp_max = Math.max(
              acc[date].temp_max,
              item.main.temp_max
            );
            acc[date].temp_min = Math.min(
              acc[date].temp_min,
              item.main.temp_min
            );
          }
          return acc;
        }, {});

        setForecastData(Object.values(dailyData).slice(0, 5));
      } catch (err) {
        console.error("Forecast API Error:", err);
        //use the specific error message from the API service if available
        setError(err.message || "Failed to fetch forecast data");
      } finally {
        //clear the loading timer and set loading to false
        if (loadingTimerRef.current) {
          clearTimeout(loadingTimerRef.current);
          loadingTimerRef.current = null;
        }
        setLoading(false);
      }
    };

    fetchForecastData();

    //cleanup timeout on unmount or when dependencies change
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [city, selectedUnit]);

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <section className="week-forecast" aria-labelledby="forecast-title">
      <h3 id="forecast-title" className="forecast-title">
        5-Day Forecast
      </h3>{" "}
      <div className="forecast-content">
        {loading && (
          <div className="loading-overlay" role="status">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              size="3x"
              className="loading-spinner"
            />
          </div>
        )}
        <div className={`days ${loading ? "loading-dim" : ""}`}>
          {forecastDays.map((day, index) => {
            const forecast = forecastData?.[index];
            return (
              <article
                key={day.name}
                className="prediction"
                aria-label={`Weather forecast for ${day.name}`}
              >
                <header className="day-head">
                  <div className="day-info">
                    <h3>{day.name}</h3>
                    <span className="day-date" aria-label={`Date: ${day.date}`}>
                      {day.date}
                    </span>
                  </div>
                  {forecast?.weather && (
                    <img
                      src={getWeatherIcon(forecast.weather.icon)}
                      alt={forecast.weather.description}
                      className="weather-icon"
                    />
                  )}
                </header>
                <div className="day-content">
                  <div className="temperature-range">
                    <div className="temp-high" aria-label="High temperature">
                      <span>
                        {forecast ? Math.round(forecast.temp_max) : "--"}°
                      </span>
                      <label>High</label>
                    </div>
                    <div className="temp-low" aria-label="Low temperature">
                      <span>
                        {forecast ? Math.round(forecast.temp_min) : "--"}°
                      </span>
                      <label>Low</label>
                    </div>
                  </div>
                  <div className="day-details">
                    <div className="detail-item" aria-label="Chance of rain">
                      <span>
                        {forecast ? Math.round(forecast.rain) : "--"}%
                      </span>
                      <label>Rain</label>
                    </div>
                    <div className="detail-item" aria-label="Wind speed">
                      <span>
                        {forecast ? Math.round(forecast.wind) : "--"}
                        {selectedUnit === "imperial" ? "mph" : "km/h"}
                      </span>
                      <label>Wind</label>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
