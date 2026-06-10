# Weather Dashboard

A responsive weather dashboard built with React and SCSS. It provides current weather, 5-day forecasts, geolocation-based lookup, search history, dynamic weather backgrounds, and temperature unit conversion.

Live site: https://liciapereira.github.io/weather-app/

## Why This Project Matters

This project shows practical frontend fundamentals: API integration, async loading states, geolocation permissions, local storage, responsive styling, and user-friendly error handling.

## Tech Stack

- React
- JavaScript
- SCSS
- OpenWeatherMap API
- Geolocation API
- LocalStorage
- GitHub Pages

## Features

- Search current weather by city.
- Use browser geolocation to detect the user's city.
- Display current conditions and a 5-day forecast.
- Switch between Celsius, Fahrenheit, and Kelvin.
- Save recent searches in local storage.
- Show weather-based background videos.
- Support light and dark themes.
- Handle loading, location, and API error states.

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
REACT_APP_API_KEY=your_openweathermap_api_key
```

Start the app:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm start
npm run build
npm test
npm run deploy
```

## Development Notes

The strongest parts of this project are the API integration, geolocation flow, local search history, responsive UI, and weather-driven visual states.
