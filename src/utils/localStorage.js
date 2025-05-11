const SEARCH_HISTORY_KEY = "weatherAppSearchHistory";

export const getSearchHistory = () => {
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (city) => {
  const history = getSearchHistory();
  // Add city if it doesn't exist, move it to front if it does
  const newHistory = [
    city,
    ...history.filter((item) => item.toLowerCase() !== city.toLowerCase()),
  ].slice(0, 5); // Keep only last 5 searches
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
};

export const removeFromSearchHistory = (cityToRemove) => {
  const history = getSearchHistory();
  const newHistory = history.filter(
    (city) => city.toLowerCase() !== cityToRemove.toLowerCase()
  );
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
  return newHistory;
};
