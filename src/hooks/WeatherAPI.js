import { useEffect, useState } from "react";

export default function useWeatherAPI(city) {
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
        const url = `https://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}&units=m`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.error) {
          throw new Error(result.error.info || "Failed to fetch weather data");
        }

        setTemperature(result.current.temperature);
        setWeathericon(result.current.weather_icons[0]);
        setFeelsLike(result.current.feelslike);
        setHumidity(result.current.humidity);
        setWindSpeed(result.current.wind_speed);
        setWeatherCondition(result.current.weather_descriptions[0]);
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
  }, [city]);

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
