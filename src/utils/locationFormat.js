/**
 * Convert state/province names to their standard abbreviations
 * @param {string} stateName - The full name of the state/province
 * @returns {string} - The abbreviated state/province code
 */
const getStateAbbreviation = (stateName) => {
  if (!stateName) return "";

  // US States
  const usStates = {
    alabama: "AL",
    alaska: "AK",
    arizona: "AZ",
    arkansas: "AR",
    california: "CA",
    colorado: "CO",
    connecticut: "CT",
    delaware: "DE",
    florida: "FL",
    georgia: "GA",
    hawaii: "HI",
    idaho: "ID",
    illinois: "IL",
    indiana: "IN",
    iowa: "IA",
    kansas: "KS",
    kentucky: "KY",
    louisiana: "LA",
    maine: "ME",
    maryland: "MD",
    massachusetts: "MA",
    michigan: "MI",
    minnesota: "MN",
    mississippi: "MS",
    missouri: "MO",
    montana: "MT",
    nebraska: "NE",
    nevada: "NV",
    "new hampshire": "NH",
    "new jersey": "NJ",
    "new mexico": "NM",
    "new york": "NY",
    "north carolina": "NC",
    "north dakota": "ND",
    ohio: "OH",
    oklahoma: "OK",
    oregon: "OR",
    pennsylvania: "PA",
    "rhode island": "RI",
    "south carolina": "SC",
    "south dakota": "SD",
    tennessee: "TN",
    texas: "TX",
    utah: "UT",
    vermont: "VT",
    virginia: "VA",
    washington: "WA",
    "west virginia": "WV",
    wisconsin: "WI",
    wyoming: "WY",
    "district of columbia": "DC",
  };

  // Canadian Provinces
  const canadianProvinces = {
    alberta: "AB",
    "british columbia": "BC",
    manitoba: "MB",
    "new brunswick": "NB",
    "newfoundland and labrador": "NL",
    newfoundland: "NL",
    labrador: "NL",
    "northwest territories": "NT",
    "nova scotia": "NS",
    nunavut: "NU",
    ontario: "ON",
    "prince edward island": "PE",
    quebec: "QC",
    saskatchewan: "SK",
    yukon: "YT",
  };

  //Australian States/Territories
  const australianStates = {
    "australian capital territory": "ACT",
    "new south wales": "NSW",
    "northern territory": "NT",
    queensland: "QLD",
    "south australia": "SA",
    tasmania: "TAS",
    victoria: "VIC",
    "western australia": "WA",
  };

  // UK Countries
  const ukCountries = {
    england: "ENG",
    "northern ireland": "NIR",
    scotland: "SCT",
    wales: "WLS",
  };

  const stateNameLower = stateName.toLowerCase();

  //check each dictionary
  if (usStates[stateNameLower]) return usStates[stateNameLower];
  if (canadianProvinces[stateNameLower])
    return canadianProvinces[stateNameLower];
  if (australianStates[stateNameLower]) return australianStates[stateNameLower];
  if (ukCountries[stateNameLower]) return ukCountries[stateNameLower];

  // handle "State of X" format
  if (stateNameLower.startsWith("state of ")) {
    const trimmedState = stateNameLower.replace("state of ", "");
    if (usStates[trimmedState]) return usStates[trimmedState];
  }

  //if not found in our dictionaries, return first letter of each word
  // for states with multiple words like "South Australia" → "SA"
  if (stateName.includes(" ")) {
    return stateName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  }

  //for single word states not in our dictionary, return first two letters
  return stateName.substring(0, 2).toUpperCase();
};

/**
 * Formats a location with state/province abbreviation and country code
 * @param {Object} location - Location object with name, state and country properties
 * @returns {string} - Formatted location string (e.g., "London, ON, CA" or "London, UK")
 */
const formatLocationWithAbbr = (location) => {
  if (!location) return "";

  const cityName = location.name || "";
  const stateName = location.state || "";
  const countryCode = location.country || "";

  let formattedLocation = cityName;

  if (stateName) {
    const stateAbbr = getStateAbbreviation(stateName);
    if (stateAbbr) {
      formattedLocation += `, ${stateAbbr}`;
    }
  }

  if (countryCode) {
    formattedLocation += `, ${countryCode}`;
  }

  return formattedLocation;
};

export { getStateAbbreviation, formatLocationWithAbbr };
