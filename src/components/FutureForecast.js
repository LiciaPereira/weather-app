import React, { useState, useEffect } from "react";
import { getFiveDayForecast } from "../services/weatherService";

export default function FutureForecast({ city, selectedUnit = "metric" }) {
  const [forecastDays, setForecastDays] = useState([]);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      setLoading(true);
      setError(null);
      try {
        const data = await getFiveDayForecast(city, selectedUnit);

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
        setError("Failed to fetch forecast data");
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [city, selectedUnit]);

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return <div className="loading">Loading forecast data...</div>;
  }

  return (
    <section className="week-forecast" aria-labelledby="forecast-title">
      <h3 id="forecast-title" className="forecast-title">
        5-Day Forecast
      </h3>
      <div className="days">
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
                    <span>{forecast ? Math.round(forecast.rain) : "--"}%</span>
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
    </section>
  );
}
