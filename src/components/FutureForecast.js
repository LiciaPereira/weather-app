import React, { useState, useEffect } from "react";

export default function FutureForecast() {
  const [forecastDays, setForecastDays] = useState([]);

  useEffect(() => {
    const day = new Date();
    const week = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

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

  return (
    <section className="week-forecast" aria-labelledby="forecast-title">
      <h2 id="forecast-title" className="forecast-title">
        5-Day Forecast
      </h2>
      <div className="days">
        {forecastDays.map((day, index) => (
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
              <span
                className="weather-icon"
                role="img"
                aria-label="Sunny weather"
              >
                🌤️
              </span>
            </header>
            <div className="day-content">
              <div className="temperature-range">
                <div className="temp-high" aria-label="High temperature">
                  <span>15°</span>
                  <label>High</label>
                </div>
                <div className="temp-low" aria-label="Low temperature">
                  <span>8°</span>
                  <label>Low</label>
                </div>
              </div>
              <div className="day-details">
                <div className="detail-item" aria-label="Chance of rain">
                  <span>10%</span>
                  <label>Rain</label>
                </div>
                <div className="detail-item" aria-label="Wind speed">
                  <span>12km/h</span>
                  <label>Wind</label>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
