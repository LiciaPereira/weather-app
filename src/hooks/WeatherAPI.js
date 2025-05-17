import { useEffect, useState, useRef } from "react";
import { getCurrentWeather } from "../services/weatherService";

export default function useWeatherAPI(city, unit = "metric", onError = null) {
  const [temperature, setTemperature] = useState("");
  const [weathericon, setWeathericon] = useState("");
  const [humidity, setHumidity] = useState("");
  const [feelsLike, setFeelsLike] = useState("");
  const [windSpeed, setWindSpeed] = useState("");
  const [weatherCondition, setWeatherCondition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingTimerRef = useRef(null);
  useEffect(() => {
    if (!city) return;

    // set a minimum loading time to prevent flashing
    if (loadingTimerRef.current) {
      clearTimeout(loadingTimerRef.current);
    }

    setIsLoading(true);

    const fetchWeatherData = async () => {
      setError(null);

      try {
        // check if we have stored location data with coordinates
        const storedLocationData = localStorage.getItem("lastSelectedLocation");
        let result;

        if (storedLocationData) {
          const locationData = JSON.parse(storedLocationData);

          // only use the stored coordinates if they match the current city name
          // This prevents using outdated coordinates for a new search
          if (locationData.displayName === city) {
            result = await getCurrentWeather(
              city,
              unit,
              locationData.lat,
              locationData.lon
            );
          } else {
            result = await getCurrentWeather(city, unit);
          }
        } else {
          result = await getCurrentWeather(city, unit);
        }

        setTemperature(parseInt(result.main.temp));
        setWeathericon(
          `http://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`
        );
        setFeelsLike(parseInt(result.main.feels_like));
        setHumidity(result.main.humidity);
        setWindSpeed(result.wind.speed);
        setWeatherCondition(result.weather[0].main.toLowerCase());
      } catch (error) {
        console.error("Weather API Error:", error);

        //get the error message
        const errorMsg =
          error.message || "Failed to fetch weather data. Please try again.";

        //set the error in the hook's state
        setError(errorMsg);
        //if an error handler was provided, call it
        if (onError) {
          onError(errorMsg);
        }
      } finally {
        //ensure loading state is shown for at least 500ms to avoid flickering
        loadingTimerRef.current = setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchWeatherData();

    //cleanup timeout on unmount or when dependencies change
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [city, unit, onError]);

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
