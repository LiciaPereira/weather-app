export default function getBackgroundMedia(weatherCondition) {
  const basePath = process.env.REACT_APP_PUBLIC_URL || "";
  let backgroundVideo = `${basePath}/videos/clear-sky.mp4`; // Default video
  let altText = "Clear sunny sky video background"; // Default alt text

  // Map weather conditions to appropriate backgrounds
  switch (weatherCondition?.toLowerCase()) {
    case "clear":
      backgroundVideo = `${basePath}/videos/clear-sky.mp4`;
      altText = "Clear sunny sky video background";
      break;

    case "clouds":
      backgroundVideo = `${basePath}/videos/few-clouds.mp4`;
      altText = "Few clouds moving across the sky video background";
      break;

    case "rain":
    case "drizzle":
      backgroundVideo = `${basePath}/videos/rain.mp4`;
      altText = "Rain falling from dark clouds video background";
      break;

    case "thunderstorm":
      backgroundVideo = `${basePath}/videos/thunderstorm.mp4`;
      altText = "Storm clouds with lightning video background";
      break;

    case "snow":
      backgroundVideo = `${basePath}/videos/snow.mp4`;
      altText = "Snow falling against dark sky video background";
      break;

    case "mist":
    case "fog":
    case "haze":
      backgroundVideo = `${basePath}/videos/mist.mp4`;
      altText = "Misty atmosphere video background";
      break;

    default:
      backgroundVideo = `${basePath}/videos/clear-sky.mp4`;
      altText = "Clear sunny sky video background";
  }

  return { backgroundVideo, altText };
}
