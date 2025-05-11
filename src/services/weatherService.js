const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Array of API keys to use in rotation when hitting limits
const API_KEYS = [
  process.env.REACT_APP_API_KEY,
  process.env.REACT_APP_API_KEY_BACKUP,
  process.env.REACT_APP_API_KEY_BACKUP_BACKUP,
].filter(Boolean); // Remove any undefined keys

let currentKeyIndex = 0;

const makeApiRequest = async (url) => {
  let lastError;

  // Try with each API key until one works
  for (let attempts = 0; attempts < API_KEYS.length; attempts++) {
    try {
      const currentKey = API_KEYS[currentKeyIndex];
      const finalUrl = `${url}&appid=${currentKey}`;
      const response = await fetch(finalUrl);
      const data = await response.json();

      // Check if we hit the API limit
      if (
        response.status === 429 ||
        data.cod === 429 ||
        (data.message && data.message.includes("limit"))
      ) {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        continue;
      }

      return data;
    } catch (error) {
      lastError = error;
      currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    }
  }

  // If we've tried all keys and none worked
  throw lastError || new Error("All API keys have reached their limits");
};

export const getCurrentWeather = async (city, unit = "metric") => {
  const baseUrl = `${BASE_URL}/weather?q=${city}&units=${unit}`;
  const data = await makeApiRequest(baseUrl);

  if (data.cod !== 200) {
    throw new Error(data.message || "Failed to fetch weather data");
  }

  return data;
};

export const getFiveDayForecast = async (city, unit = "metric") => {
  const baseUrl = `${BASE_URL}/forecast?q=${city}&units=${unit}`;
  const data = await makeApiRequest(baseUrl);

  if (data.cod !== "200") {
    throw new Error(data.message || "Failed to fetch forecast data");
  }

  return data;
};

export const getLocationByCoords = async (latitude, longitude) => {
  const baseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1`;
  const data = await makeApiRequest(baseUrl);

  if (!data.length) {
    throw new Error("Failed to get location data");
  }

  return data[0];
};
