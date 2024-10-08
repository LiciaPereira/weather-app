import React from "react";
import WeatherAPI from "../hooks/WeatherAPI";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar() {
    
    return (
        <div className="search-bar">
            <input placeholder="Search city..." type='search' onChange={(e) => {setSearchText(e.target.value)}}></input>
            <button onClick={() => {WeatherAPI(searchText)}}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
        </div>
    )
}