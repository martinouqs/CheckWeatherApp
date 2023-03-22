import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./styles.css";
import { AiOutlineHistory } from "react-icons/ai";
import { FaTemperatureHigh } from "react-icons/fa";
import { GiWaterDrop } from "react-icons/gi";
import { BsWind } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { IoLocationOutline } from 'react-icons/io5';
import { BiX } from 'react-icons/bi';


function App() {
  const [city, setCity] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_KEY = 'feff027e2d9991fe2037987aeacee6c0';

  const handleSearch = async (e, searchCity) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=metric&appid=${API_KEY}`);
      setTemperature(data.main.temp);
      setHumidity(data.main.humidity);
      setWindSpeed(data.wind.speed);
      addToSearchHistory(searchCity);
    } catch (error) {
      setErrorMessage(`No se ha encontrado información relativa a la localización "${searchCity}"`);
    }
    setIsLoading(false);
  };

  const addToSearchHistory = (searchCity) => {
    if (searchHistory.includes(searchCity)) return;

    if (searchHistory.length === 5) {
      setSearchHistory((prevSearchHistory) => {
        prevSearchHistory.pop();
        return [searchCity, ...prevSearchHistory];
      });
    } else {
      setSearchHistory((prevSearchHistory) => [searchCity, ...prevSearchHistory]);
    }
  };

  const handleSearchHistoryClick = async (searchCity) => {
    setCity(searchCity);
    await handleSearch({ preventDefault: () => {} }, searchCity);
  };

  useEffect(() => {
    if (searchHistory.length > 0) {
      setCity(searchHistory[0]);
      handleSearch({ preventDefault: () => {} }, searchHistory[0]);
    }
  }, [searchHistory]);

  return (
    <div id="mainContainer">
        <div id="elementsContainer" class="d-flex flex-column justify-content-center align-items-center">
        <h1 class="display-4">WeatherCheck</h1>
        <form class="weather-form" onSubmit={(e) => handleSearch(e, city)}>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Busca una ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {city && (
              <button
                type="button"
                class="btn btn-primary"
                onClick={() => setCity('')}
              >
                <BiX />
              </button>
            )}
            <button type="submit" class="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Cargando...' : ''}
              <BiSearchAlt2 />
            </button>
          </div>
        </form>

      {errorMessage && <p style={{ color: 'red', textAlign: 'center', marginTop: '3em' }}>{errorMessage}</p>}
        {isLoading && <p>Cargando...</p>}
        {temperature && !errorMessage && (
          <div id='boxInfo' class='container-fluid p-4'>
            <h4> <IoLocationOutline />Lugar: {city}</h4>
            <p><FaTemperatureHigh /> Temperatura: {temperature} °C</p>
            <p><GiWaterDrop /> Humedad: {humidity}%</p>
            <p><BsWind /> Velocidad del viento: {windSpeed} m/s</p>
          </div>
        )}
        {searchHistory.length > 0 && (
          <div class="history-box">
            <h5> Historial de búsquedas <AiOutlineHistory /></h5>
            <ul>
              {searchHistory.map((searchCity) => (
                <li class="list-unstyled" key={searchCity}>
                  <div></div>
                  <button class="btn btn-unstyled ps-3" onClick={() => handleSearchHistoryClick(searchCity)}><IoLocationOutline />{searchCity}</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default App;
