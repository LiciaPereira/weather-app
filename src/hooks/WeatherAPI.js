import { useEffect, useState } from "react";

export default function useWeatherAPI(city) {
    //const [unit, setUnit] = ('m');
    const [temperature, setTemperature] = useState('');
    const [weathericon, setWeathericon] = useState('');
    const [humidity, setHumidity] = useState('');
    const [feelsLike, setFeelsLike] = useState('');
    const [windSpeed, setWindSpeed] = useState('');
    const [weatherCondition, setWeatherCondition] = useState('');

    useEffect(() => {
        if (!city)
            return;
        const fetchWeatherData = async() => {
            const url = `https://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}&units=m`;     
            
            try {
                const response = await fetch(url);
                const result = JSON.parse(await response.text());

                setTemperature(result.current.temperature);
                setWeathericon(result.current.weather_icons[0]);
                setFeelsLike(result.current.feelslike);
                setHumidity(result.current.humidity);
                setWindSpeed(result.current.wind_speed);
                setWeatherCondition(result.current.weather_descriptions[0]);
                console.log(result);
            } catch (error) {
                console.error(error);
            }
        };
        
        fetchWeatherData();
    }, [city])
    return { temperature, weathericon, humidity, feelsLike, windSpeed, weatherCondition}
}