# Weather Dashboard

A modern, responsive weather dashboard built with React that provides current weather conditions and 5-day forecasts for any city worldwide.

## Technologies Used

- React.js
- SCSS for styling
- OpenWeatherMap API
- Font Awesome Icons
- Local Storage for data persistence

## Features

- Real-time weather data from OpenWeatherMap API
- Current weather conditions display
- 5-day weather forecast
- Dynamic background videos based on weather conditions
- Temperature unit conversion (Celsius/Fahrenheit/Kelvin)
- Search history management
- Automatic user location detection
- Light/Dark theme support
- Responsive design for all devices
- Fallback API key system for reliable service
- Improved geolocation support with better error handling and user feedback
- Added location format display with state/province abbreviations
- Optimized API usage with coordinate-based searches for better accuracy
- Enhanced loading states with smart delay (2.5s threshold for spinners)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/weather-app.git
```

2. Install dependencies:

```bash
cd weather-app
npm install
```

3. Create a `.env` file in the root directory with your OpenWeatherMap API key:

```
REACT_APP_API_KEY=your_api_key_here
```

4. Start the development server:

```bash
npm start
```

## Geolocation Features

The app provides smart location-based weather information:

- Automatic location detection on initial load (with user permission)
- Graceful fallback to default city if location access is denied
- Informative error messages for various geolocation scenarios
- Uses coordinates for more accurate weather data when available
- Saves location data to improve subsequent searches

## Environment Variables

The app uses the following environment variables:

- `REACT_APP_API_KEY`: Primary OpenWeatherMap API key
- `REACT_APP_API_KEY_BACKUP`: Backup API key
- `REACT_APP_API_KEY_BACKUP_BACKUP`: Secondary backup API key

## Deployment

The app is deployed using GitHub Pages. To deploy:

1. Update the `homepage` field in `package.json`:

```json
{
  "homepage": "https://yourusername.github.io/weather-app"
}
```

2. Build and deploy:

```bash
npm run build
npm run deploy
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
