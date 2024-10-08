import React, { useState, useEffect } from "react";
import useWeatherAPI from "../hooks/WeatherAPI";
import getBackgroundMedia from "../utils/weatherBackground";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../style/weather.scss';
import ColorTheme from "./ColorTheme";

export default function Weather() {
    //<img src={watertrees} alt="a body of water surrounded by trees and clouds" className="water-trees-img"/>
    const [city, setCity] = useState('Jundiai');
    const degrees= 'C';
    const [searchedText, setSearchedText] = useState('');
    const [checked, setChecked] = useState(false);
    
    const [backgroundMedia, setBackgroundMedia] = useState({
        backgroundVideo: require('../assets/images/cloudy.mp4'),
        altText: 'a'
    });

    const { temperature, weathericon, humidity, feelsLike, windSpeed, weatherCondition } = useWeatherAPI(city);

    useEffect(() => {
        if (weatherCondition) {
            const { backgroundVideo, altText } = getBackgroundMedia(weatherCondition);  // Call the function to get video and alt text
            setBackgroundMedia({ backgroundVideo, altText });  // Set the state with the new video and alt text
        }
    }, [city, weatherCondition]);  // This effect runs whenever 'city' or 'weathericon' changes

    const handleSearch = () => {
        setCity(searchedText);
    };

    return (
        <div className="container">
            <video className="background-video" autoPlay loop muted>
                <source src={backgroundMedia.backgroundVideo} type="video/mp4" />
            </video>
            <div className="todays-info">
                <div className="weather-app-name">Licia's weather thingy</div>
                <div className="current-city-info">
                    <div className="cur-temperature">{temperature ? temperature : '18'}°{degrees}</div>
                    <div className="divider">|</div>
                    <div className="cur-city">{city ? city : 'Jundiai'}</div>
                    <div className="cur-icon">{weathericon ? <img src={weathericon} alt="weather-icon"/> : '🌤️'} </div>
                </div>
            </div>
            <div className="more-info">
                <div className="search-bar">
                    <input placeholder="Search city..." type='search' onChange={(e) => {setSearchedText(e.target.value)}}></input>
                    <button onClick={handleSearch}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                </div>
                <div className="information">
                    <div className="more-info-info">
                        <div className="cur-feelslike">{feelsLike ? feelsLike: '15'}°{degrees}</div>
                        <label>Feels Like</label>
                    </div>
                    <div className="more-info-info">
                        <div className="cur-humidity">{humidity ? humidity : '70'}%</div>
                        <label>Humidity</label>
                    </div>
                    <div className="more-info-info">
                        <div className="cur-wind-speed">{windSpeed ? windSpeed : '70'}%</div>
                        <label>Wind Speed</label>
                    </div>
                </div>
            </div>
            <div className="week-forecast">

            </div>
            <div className="color-theme">
                <button onClick={() => {
                    ColorTheme(checked);
                    setChecked(!checked);
                }}>{checked ? "☀️" : "🌙"}</button>
            </div>
            <div className="settings">

            </div>
        </div>
    )
}