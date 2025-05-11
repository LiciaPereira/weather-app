import { useEffect, useState } from "react";
import { getCurrentWeather } from "../services/weatherService";

export default function useWeatherAPI(city, unit = "metric") {
  const [temperature, setTemperature] = useState("");
  const [weathericon, setWeathericon] = useState("");
  const [humidity, setHumidity] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!city) return;

    const fetchWeatherData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getCurrentWeather(city, unit);
        setTemperature(parseInt(result.main.temp));
        setWeathericon(
          `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
        );
        setFeelsLike(parseInt(result.main.feels_like));
        setHumidity(result.main.humidity);
        setWindSpeed(result.wind.speed); // Get both the main condition and description for more accurate background matching
        setWeatherCondition(result.weather[0].main.toLowerCase());
      } catch (error) {
        console.error("Weather API Error:", error);
        setError("Failed to fetch weather data. Please try again.");
        // Reset the weather data
        setTemperature("");
        setWeathericon("");
        setFeelsLike("");
        setHumidity("");
        setWindSpeed("");
        setWeatherCondition("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeatherData();
  }, [city, unit]);

  return {
    temperature,
    weathericon,
    humidity,
    feelsLike,
    windSpeed,
    weatherCondition,
    isLoading,
    error,
  };
}
