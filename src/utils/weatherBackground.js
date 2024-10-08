export default function getBackgroundMedia(weatherCondition) {
    let backgroundVideo = '';
    let altText = '';

    switch (weatherCondition) {
        case 'Sunny':
            backgroundVideo = require('../assets/images/blue-sky.mp4');
            altText = 'Clear sunny sky video background';
            break;
        default:
            backgroundVideo = require('../assets/images/cloudy.mp4');
            altText = 'Clouds in the sky video background';
            break;
    }

    return { backgroundVideo, altText };
}