const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

// array of API keys to use in rotation when hitting limits
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

export const getCurrentWeather = async (
  city,
  unit = "metric",
  lat = null,
  lon = null
) => {
  //use coordinates if provided (more accurate), otherwise use city name
  const baseUrl =
    lat && lon
      ? `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}`
      : `${BASE_URL}/weather?q=${city}&units=${unit}`;

  const data = await makeApiRequest(baseUrl);

  if (data.cod !== 200) {
    // provide more specific error messages based on different error codes
    if (data.cod === "404") {
      throw new Error(
        `City "${city}" not found. Please check the spelling and make sure to use English names for cities.`
      );
    } else if (data.cod === "401") {
      throw new Error("API authentication failed. Please try again later.");
    } else if (data.cod === "429") {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw new Error(data.message || "Failed to fetch weather data");
    }
  }

  return data;
};

export const getFiveDayForecast = async (
  city,
  unit = "metric",
  lat = null,
  lon = null
) => {
  //use coordinates if provided (more accurate), otherwise use city name
  const baseUrl =
    lat && lon
      ? `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}`
      : `${BASE_URL}/forecast?q=${city}&units=${unit}`;

  const data = await makeApiRequest(baseUrl);

  if (data.cod !== "200") {
    // provide more specific error messages based on different error codes
    if (data.cod === "404") {
      throw new Error(
        `City "${city}" not found. Please check the spelling and make sure to use English names for cities.`
      );
    } else if (data.cod === "401") {
      throw new Error("API authentication failed. Please try again later.");
    } else if (data.cod === "429") {
      throw new Error("Too many requests. Please try again later.");
    } else {
      throw new Error(data.message || "Failed to fetch forecast data");
    }
  }

  return data;
};

export const getLocationByCoords = async (latitude, longitude) => {
  const baseUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1`;
  const data = await makeApiRequest(baseUrl);

  if (!data.length) {
    throw new Error(
      "Could not determine your location. Please search for a city manually."
    );
  }

  const location = data[0];

  // we'll let the Weather component handle formatting with abbreviations
  // enhanced location object - let Weather component handle formatting displayName
  return {
    ...location,
    searchName: location.name.toLowerCase(),
  };
};

export const searchCitiesByName = async (cityName, limit = 5) => {
  if (!cityName || cityName.trim() === "") {
    return [];
  }
  try {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(
      cityName.trim()
    )}&limit=${limit}`;
    const data = await makeApiRequest(url);

    if (!Array.isArray(data)) {
      throw new Error("Invalid response from geocoding API");
    }

    return data.map((item) => ({
      name: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
      // just return the raw data, let Weather component handle formatting
    }));
  } catch (error) {
    console.error("Geocoding API Error:", error);
    throw new Error("Failed to search for cities. Please try again.");
  }
};
