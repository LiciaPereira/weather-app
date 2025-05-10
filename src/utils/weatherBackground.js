export default function getBackgroundMedia(weatherCondition) {
  let backgroundVideo = "";
  let altText = "";

  // Map weather conditions to appropriate backgrounds
  switch (weatherCondition?.toLowerCase()) {
    case "sunny":
    case "clear":
      backgroundVideo = require("../assets/images/blue-sky.mp4");
      altText = "Clear sunny sky video background";
      break;
    case "partly cloudy":
    case "cloudy":
    case "overcast":
      backgroundVideo = require("../assets/images/cloudy.mp4");
      altText = "Clouds moving across the sky video background";
      break;
    case "thunderstorm":
    case "storm":
    case "rain":
      backgroundVideo = require("../assets/images/night-storm.mp4");
      altText = "Storm clouds with lightning video background";
      break;
    default:
      backgroundVideo = require("../assets/images/blue-sky.mp4");
      altText = "Default sky video background";
      break;
  }

  return { backgroundVideo, altText };
}
