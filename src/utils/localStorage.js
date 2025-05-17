const SEARCH_HISTORY_KEY = "weatherAppSearchHistory";
const SEARCH_HISTORY_DETAILS_KEY = "weatherAppSearchHistoryDetails";

export const getSearchHistory = () => {
  //for backward compatibility
  const history = localStorage.getItem(SEARCH_HISTORY_KEY);
  const detailedHistory = localStorage.getItem(SEARCH_HISTORY_DETAILS_KEY);

  if (detailedHistory) {
    return JSON.parse(detailedHistory);
  }

  return history ? JSON.parse(history) : [];
};

export const addToSearchHistory = (locationData) => {
  const history = getSearchHistory();

  // convert string to object if it's not already
  let locationObj = locationData;
  if (typeof locationData === "string") {
    locationObj = {
      displayName: locationData,
      fullName: locationData,
      searchName: locationData.toLowerCase(),
    };
  }
  //check for duplicates using various criteria
  const isDuplicate = (item) => {
    //if both items have coordinates, check if they refer to the same location
    if (item.lat && item.lon && locationObj.lat && locationObj.lon) {
      return (
        Math.abs(item.lat - locationObj.lat) < 0.01 &&
        Math.abs(item.lon - locationObj.lon) < 0.01
      );
    }
    //check for name matches (case-insensitive)
    if (item.searchName && locationObj.searchName) {
      return (
        item.searchName.toLowerCase() === locationObj.searchName.toLowerCase()
      );
    }
    // fallback to simple string comparison
    return item.displayName === locationObj.displayName;
  };

  //add location if it doesn't exist or move it to front if it does
  const newHistory = [
    locationObj,
    ...history.filter((item) => !isDuplicate(item)),
  ].slice(0, 6); // Keep only last 6 searches

  localStorage.setItem(SEARCH_HISTORY_DETAILS_KEY, JSON.stringify(newHistory));

  // also update the old format for backward compatibility
  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(newHistory.map((item) => item.displayName))
  );

  return newHistory;
};

export const removeFromSearchHistory = (locationToRemove) => {
  const history = getSearchHistory();

  // handle both string and object formats
  const searchName =
    typeof locationToRemove === "string"
      ? locationToRemove.toLowerCase()
      : locationToRemove.searchName;

  const newHistory = history.filter(
    (item) =>
      item.searchName !== searchName &&
      (typeof item === "string" ? item.toLowerCase() !== searchName : true)
  );

  localStorage.setItem(SEARCH_HISTORY_DETAILS_KEY, JSON.stringify(newHistory));

  //also update the old format for backward compatibility
  localStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(newHistory.map((item) => item.displayName))
  );

  return newHistory;
};
