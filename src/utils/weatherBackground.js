export default function getBackgroundMedia(weatherCondition) {
  let backgroundVideo = "/videos/clear-sky.mp4"; // Default video
  let altText = "Clear sunny sky video background"; // Default alt text

  // Map weather conditions to appropriate backgrounds
  switch (weatherCondition?.toLowerCase()) {
    case "clear":
      backgroundVideo = "/videos/clear-sky.mp4";
      altText = "Clear sunny sky video background";
      break;

    case "clouds":
      backgroundVideo = "/videos/few-clouds.mp4";
      altText = "Few clouds moving across the sky video background";
      break;

    case "rain":
    case "drizzle":
      backgroundVideo = "/videos/rain.mp4";
      altText = "Rain falling from dark clouds video background";
      break;

    case "thunderstorm":
      backgroundVideo = "/videos/thunderstorm.mp4";
      altText = "Storm clouds with lightning video background";
      break;

    case "snow":
      backgroundVideo = "/videos/snow.mp4";
      altText = "Snow falling against dark sky video background";
      break;

    case "mist":
    case "fog":
    case "haze":
      backgroundVideo = "/videos/mist.mp4";
      altText = "Misty atmosphere video background";
      break;

    default:
      backgroundVideo = "/videos/clear-sky.mp4";
      altText = "Clear sunny sky video background";
  }

  return { backgroundVideo, altText };
}
