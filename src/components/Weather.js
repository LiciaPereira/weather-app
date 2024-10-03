import React, { useState } from "react";
import '../style/weather.scss';

export default function Weather() {
    //<img src={watertrees} alt="a body of water surrounded by trees and clouds" className="water-trees-img"/>
    const [checked, setChecked] = useState(false);
    const [city, setCity] = useState('');
    const [unit, setUnit] = ('');
    const [temperature, setTemperature] = useState('');
    const [weathericon, setWeathericon] = useState('');
    const [humidity, setHumidity] = useState('');
    const [feelsLike, setFeelsLike] = useState('');
    

    const handleTheme = () => {
        setChecked(!checked)

        if (checked) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    const search = async (city) => {
        const url = `https://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${city}&units=${unit}`;
        const options = {
            method: "GET",
        };

        try {
            const response = await fetch(url, options);
            const result = JSON.parse(await response.text());
            setCity(result.location.name);
            setTemperature(result.current.temperature);
            setWeathericon(result.current.weather_icons[0]);
            setFeelsLike(result.current.feelslike);
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">
            <div className="todays-info">
                <input placeholder="Search city..." type='text' onChange={(e) => {setCity(e.target.value)}}></input>
                <button onClick={() => {search(city)}}>Search</button>
                <div className="current-city-info">
                    <div className="cur-date">Temp: {temperature}</div>
                    <div className="cur-city">City: {city}</div>
                </div>
            </div>
            <div className="more-info">
                <div className="cur-date">Feels Like:{feelsLike}</div>
                <div className="cur-icon">Icon: <img src={weathericon} alt="weather-icon"/></div>
            </div>
            <div className="week-forecast">

            </div>
            <div className="color-theme">
                <button onClick={handleTheme}>{checked ? "light" : "dark"}</button>
            </div>
            <div className="settings">

            </div>
        </div>
    )
}