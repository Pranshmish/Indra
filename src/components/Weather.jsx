import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import serch_icon from '../assets/search.png';
import drizzle from '../assets/cloudy (1).png';
import sunny from '../assets/sun.png';
import rainy from '../assets/rainy.png';
import humidity from '../assets/humidity.png';
import cloudy from '../assets/cloudy.png';
import storm from '../assets/storm.png';
import wind from '../assets/wind.png';
import snowflake from '../assets/snowflake.png';
import uv from '../assets/uv.png';
import wd from '../assets/windy.png';
import ap from '../assets/pressure-gauge.png';
import vv from '../assets/visibility.png';
import Modal from './ModalCard';
import RainScene from './3D/Render/RainRenderer';
import { useLocation } from './Location';
import { useSearchLocation } from './SearchLocation';
import SnowRender from './3D/Render/SnowRenderer';

gsap.registerPlugin(ScrollTrigger);

const Weather = ({ city }) => {
  const inputRef = useRef();
  const weatherRef = useRef();
  const currentWeatherRef = useRef();
  const hourlyForecastRef = useRef();
  const hourlyScrollerRef = useRef();
  const weatherDetailsRef = useRef();
  const weeklyForecastRef = useRef();
  const searchTimeout = useRef(null);

  const [cityname, setCityName] = useState();
  const { searchQuery, setSearchQuery } = useSearchLocation();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [hourStartIndex, setHourStartIndex] = useState(0);
  const [selectedDetail, setSelectedDetail] = useState(null);


  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(searchTimeout.current)

    searchTimeout.current = setTimeout(() => {
      if (value) {
        search(value)
      }
    }, 800)
  };

  useEffect(() => {
    if (city) search(city);
  }, [city]);

  useEffect(() => {
    if (!currentData) return;

    // Clear any existing ScrollTrigger instances
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Only create animations for elements that exist
    if (currentWeatherRef.current) {
      gsap.fromTo(currentWeatherRef.current, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: currentWeatherRef.current,
          start: 'top center', end: 'bottom center', scrub: 1
        }
      });
    }

    // Check if weather data elements exist before animating
    const weatherDataElements = document.querySelectorAll('.weather-data > div');
    if (weatherDataElements.length > 0 && weatherDetailsRef.current) {
      gsap.fromTo(weatherDataElements, { y: 50, opacity: 0, scale: 0.8 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: weatherDetailsRef.current,
          start: 'top center+=100', toggleActions: 'play none none reverse'
        }
      });
    }

    // Only animate if hourly scroller exists
    if (hourlyScrollerRef.current && hourlyForecastRef.current) {
      gsap.to(hourlyScrollerRef.current, {
        x: () => -(hourlyScrollerRef.current.scrollWidth - hourlyScrollerRef.current.offsetWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: hourlyForecastRef.current,
          start: 'top center', end: '+=300', scrub: 1, pin: true, anticipatePin: 1
        }
      });

      const hourlyCards = document.querySelectorAll('.hourly-card');
      if (hourlyCards.length > 0) {
        gsap.fromTo(hourlyCards, { y: 50, opacity: 0, scale: 0.8 }, {
          y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: hourlyForecastRef.current,
            start: 'top center+=100', toggleActions: 'play none none reverse'
          }
        });
      }
    }

    const weeklyCards = document.querySelectorAll('.weekly-card');
    if (weeklyCards.length > 0 && weeklyForecastRef.current) {
      gsap.fromTo(weeklyCards, { y: 30, opacity: 0, scale: 0.9 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: {
          trigger: weeklyForecastRef.current,
          start: 'top center+=100', toggleActions: 'play none none reverse'
        }
      });
    }

    const temperatureDisplay = document.querySelector('.temperature-display');
    if (temperatureDisplay) {
      gsap.fromTo(temperatureDisplay, { scale: 0.5, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)'
      });
    }

    // Remove the non-existent .location-name animation
    // This was causing the error

    const weatherIcon = document.querySelector('.weather-icon');
    if (weatherIcon) {
      gsap.fromTo(weatherIcon, { rotation: 360, scale: 0 }, {
        rotation: 0, scale: 1, duration: 1, ease: 'back.out(1.7)'
      });
    }

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, [currentData]);

  const handleCloseModal = () => setShowModal(false);

  const handleDataClick = (label, value, icon) => {
    setSelectedDetail({ label, value, icon });
    setShowModal(true);
  };

  const hoursPerSlide = 4;
  const visibleHourly = hourlyForecast.slice(hourStartIndex);

  const handleNext = () => {
    if (hourStartIndex + hoursPerSlide < hourlyForecast.length)
      setHourStartIndex(hourStartIndex + hoursPerSlide);
  };

  const handlePrev = () => {
    if (hourStartIndex - hoursPerSlide >= 0)
      setHourStartIndex(hourStartIndex - hoursPerSlide);
  };

  const weatherCodeIcons = {
    1000: sunny,
    1100: sunny,
    1101: cloudy,
    1102: cloudy,
    2000: snowflake,
    4000: drizzle,
    4200: rainy,
    5000: snowflake,
    5100: snowflake,
    8000: storm
  };

  const rainyCodes = [4000, 4200];
  const isRainy = rainyCodes.includes(currentData?.weatherCode);

  const SnowCodes = [2000, 5000, 5100,8000];
  const isSnowing = SnowCodes.includes(currentData?.weatherCode);

  const lastSearchedCity = useRef('');

  // Function to check if cache is valid (less than 30 minutes old)
  const isCacheValid = (timestamp) => {
    const thirtyMinutesInMs = 30 * 60 * 1000;
    return Date.now() - timestamp < thirtyMinutesInMs;
  };

  // Function to get cached weather data for a city
  const getCachedWeatherData = (city) => {
    try {
      const cacheKey = `weather_${city.toLowerCase().trim()}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      if (isCacheValid(timestamp)) {
        return data;
      } else {
        // Remove expired cache
        localStorage.removeItem(cacheKey);
        return null;
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  // Function to cache weather data
  const cacheWeatherData = (city, data) => {
    try {
      const cacheKey = `weather_${city.toLowerCase().trim()}`;
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  const search = async (city) => {
    if (!city || city.trim() === '') return alert('Kripya Uchit City Name Bharein');
    if (city === lastSearchedCity.current)
      return;
    lastSearchedCity.current = city;
    setCityName(city);

    // Check cache first
    const cachedWeatherData = getCachedWeatherData(city);
    if (cachedWeatherData) {
      // Use cached data
      const { currentData: cachedCurrentData, hourlyForecast: cachedHourlyForecast, forecastData: cachedForecastData } = cachedWeatherData;
      
      setCurrentData(cachedCurrentData);
      setHourlyForecast(cachedHourlyForecast);
      setForecastData(cachedForecastData);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      if (!apiKey) return alert('API key is missing');

      const url = `https://api.tomorrow.io/v4/weather/forecast?location=${encodeURIComponent(city)}&apikey=${apiKey}&units=metric`;
      const response = await axios.get(url);
      const data = response.data;

      if (!data?.timelines?.hourly?.length || !data?.timelines?.daily?.length) {
        alert('Incomplete weather data.');
        return;
      }

      const current = data.timelines.hourly[0].values;
      const today = data.timelines.daily[0].values;

      const currentIcon = weatherCodeIcons[current.weatherCode] || sunny;
      const hourlyData = data.timelines.hourly.slice(0, 12).map(hour => {
        const values = hour.values;
        return {
          time: new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: Math.floor(values.temperature),
          icon: weatherCodeIcons[values.weatherCode] || sunny,
          humidity: values.humidity,
          windSpeed: values.windSpeed,
          weatherCode: values.weatherCode
        };
      });

      const dailyData = data.timelines.daily.slice(0, 7).map(day => {
        const values = day.values;
        return {
          date: new Date(day.time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temperature: Math.floor(values.temperatureMax),
          temperatureMin: Math.floor(values.temperatureMin),
          humidity: values.humidityAvg,
          windSpeed: values.windSpeedAvg,
          icon: weatherCodeIcons[values.weatherCodeMax] || sunny,
          precipitation: values.precipitationProbability,
          weatherCode: values.weatherCodeMax
        };
      });

      const currentWeatherData = {
        temperature: Math.floor(current.temperature),
        temperatureMin: Math.floor(today.temperatureMin),
        temperatureMax: Math.floor(today.temperatureMax),
        humidity: current.humidity,
        windSpeed: current.windSpeed,
        windDirection: current.windDirection,
        uvIndex: current.uvIndex,
        pressure: current.pressureSurfaceLevel,
        visibility: current.visibility,
        icon: currentIcon,
        location: data.location.name,
        weatherCode: current.weatherCode
      };

      setCurrentData(currentWeatherData);
      setHourlyForecast(hourlyData);
      setForecastData(dailyData);

      // Cache the weather data
      cacheWeatherData(city, {
        currentData: currentWeatherData,
        hourlyForecast: hourlyData,
        forecastData: dailyData
      });

    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('WEATHER DATA NHI MIL PAYA');
      setCurrentData(null);
      setForecastData([]);
      setHourlyForecast([]);
    }
  };

  useEffect(() => {
    if (location?.city) {
      search(location.city)
    }
  }, [location])

  useEffect(() => {
    if (isSnowing) {
      setDarkMode(!darkMode);
    }
  }, [isSnowing])
  
  useEffect(() => {
    if (location?.city) {
      setCityName(location.city);
    }
  }, [location?.city])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      search(searchQuery);
    }
  };

  return (
    <div ref={weatherRef} className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-indigo-950 via-gray-900 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-teal-400 text-white'}`}>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-full max-w-md">
            <input
              onKeyDown={handleKeyDown}
              onChange={handleSearchInputChange}
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              className="w-full p-4 pl-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 shadow-lg"
            />
            <img
              src={serch_icon}
              alt="Search"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => search(searchQuery)}
            />
          </div>

          <div className="flex gap-2">
            <button
              className="p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 text-white shadow-lg"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {currentData ? (
          <div className="space-y-8">
            {isRainy && (<RainScene />)}
            {isSnowing && (<SnowRender />)}
            <div ref={currentWeatherRef} className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <p className="text-3xl opacity-80">📍
                    {cityname}</p>
                  <p className="text-xl ml-4 opacity-80">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center">
                  <img src={currentData.icon} alt="Current" className="weather-icon w-24 h-24 mr-4" />
                  <div>
                    <p className="temperature-display text-7xl font-bold">{currentData.temperature}°C</p>
                    <div className="flex gap-4 text-lg">
                      <span>H: {currentData.temperatureMax}°</span>
                      <span>L: {currentData.temperatureMin}°</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div ref={weatherDetailsRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 weather-data">
              {[
                { label: "Humidity", value: `${currentData.humidity}%`, icon: humidity },
                { label: "Wind Speed", value: `${currentData.windSpeed}km/hr`, icon: wind },
                { label: "UV Index", value: currentData.uvIndex, icon: uv },
                { label: "Wind Direc.", value: `${currentData.windDirection}°`, icon: wd },
                { label: "Pressure", value: `${currentData.pressure} hPa`, icon: ap },
                { label: "Visibility", value: `${currentData.visibility} km`, icon: vv }
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleDataClick(item.label, item.value, item.icon)}
                  className="p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer hover:bg-white/30 transition-all duration-300 shadow-lg transform hover:scale-105"
                >
                  <div className="flex items-center mb-2">
                    <img src={item.icon} alt="" className="w-8 h-8 mr-2" />
                    <h4 className="font-medium">{item.label}</h4>
                  </div>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div ref={hourlyForecastRef} className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden">
              <h3 className="text-2xl font-bold mb-4">Hourly Forecast</h3>
              <div className="overflow-hidden">
                <div ref={hourlyScrollerRef} className="flex gap-4 pb-4">
                  {visibleHourly.map((hour, index) => (
                    <div
                      key={index}
                      className="hourly-card flex-shrink-0 w-32 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                      <p className="text-lg font-medium mb-2">{hour.time}</p>
                      <img src={hour.icon} alt="weather" className="w-12 h-12 mx-auto my-2" />
                      <p className="text-2xl font-bold">{hour.temperature}°C</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-4 gap-2">

                <button
                  onClick={handlePrev}
                  disabled={hourStartIndex === 0}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  ‹
                </button>
                <button
                  onClick={handleNext}
                  disabled={hourStartIndex + hoursPerSlide >= hourlyForecast.length}
                  className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 disabled:opacity-50 shadow-lg"
                >
                  ›
                </button>
              </div>
            </div>

            <div ref={weeklyForecastRef} className="bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold mb-4">7-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {forecastData.map((day, index) => (
                  <div
                    key={index}
                    className="weekly-card p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="text-center">
                      <p className="text-lg font-medium mb-2">{day.date}</p>
                      <img src={day.icon} alt="weather" className="w-16 h-16 mx-auto my-2" />
                      <div className="flex justify-center items-center gap-2">
                        <p className="text-2xl font-bold">{day.temperature}°</p>
                        <p className="text-lg opacity-80">{day.temperatureMin}°</p>
                      </div>
                      <div className="mt-2 flex justify-center items-center gap-2 text-sm">
                        <span className="flex items-center">
                          <img src={humidity} alt="humidity" className="w-4 h-4 mr-1" />
                          {day.humidity}%
                        </span>
                        <span className="flex items-center">
                          <img src={wind} alt="wind" className="w-4 h-4 mr-1" />
                          {day.windSpeed} km/h
                        </span>
                      </div>
                      {day.precipitation > 0 && (
                        <div className="mt-2 text-sm text-blue-300">
                          {day.precipitation}% chance of rain
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl">
            <p className="text-2xl">Enter a city name to get started</p>
          </div>
        )}
      </div>

      <Modal show={showModal} onClose={handleCloseModal}>
        {selectedDetail && (
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-2xl`}>
            <h3 className="text-xl font-semibold mb-4">{selectedDetail.label}</h3>
            <img src={selectedDetail.icon} alt="" className="w-12 h-12 mb-4" />
            <p className="text-2xl font-bold">{selectedDetail.value}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Weather;