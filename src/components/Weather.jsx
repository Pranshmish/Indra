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
import SnowScene from './3D/Render/SnowRenderer';
import Lottie from "lottie-react";
import flyingBear from "./SVG/flyingBear.json";
import space from './SVG/space.json'

gsap.registerPlugin(ScrollTrigger);

const Weather = ({ city }) => {
  const inputRef = useRef();
  const spaceRef = useRef();
  const bearRef = useRef(null);
  const weatherRef = useRef();
  const currentWeatherRef = useRef();
  const hourlyForecastRef = useRef();
  const hourlyScrollerRef = useRef();
  const weatherDetailsRef = useRef();
  const weeklyForecastRef = useRef();
  const searchTimeout = useRef(null);
  const bearScrollRef = useRef();

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

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    if (currentWeatherRef.current) {
      gsap.fromTo(currentWeatherRef.current, { y: 50, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: currentWeatherRef.current,
          start: 'top center', end: 'bottom center', scrub: 1
        }
      });
    }

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

  
    if (hourlyScrollerRef.current && hourlyForecastRef.current) {
      gsap.to(hourlyScrollerRef.current, {
        x: () => -(hourlyScrollerRef.current.scrollWidth - hourlyScrollerRef.current.offsetWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: hourlyForecastRef.current,
          start: 'top center', end: '+=300', scrub: 1, pin: true, anticipatePin: 1
        }
      });
    if (bearRef.current && bearScrollRef.current) {
  gsap.to(bearRef.current, {
    x: "20vw",
    ease: "power3.out",
    scrollTrigger: {
      trigger: bearScrollRef.current,
      start: "top top",
      end: "+=500",
      scrub: true,   
    },
  });
}


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
  0: sunny,            
  1: sunny,            
  2: cloudy,           
  3: cloudy,           
  45: cloudy,          
  48: cloudy,          
  51: drizzle,         
  53: drizzle,        
  55: drizzle,         
  56: drizzle,        
  57: drizzle,         
  61: rainy,           
  63: rainy,           
  65: rainy,           
  66: rainy,          
  67: rainy,           
  71: snowflake,       
  73: snowflake,      
  75: snowflake,       
  77: snowflake,       
  80: rainy,           
  81: rainy,          
  82: rainy,           
  85: snowflake,       
  86: snowflake,       
  95: storm,          
  96: storm,           
  99: storm           
};

const rainyCodes = [ 61, 63, 65, 66, 67, 80, 81, 82,95,96,];
const isRainy = rainyCodes.includes(currentData?.weatherCode);

const snowCodes = [71, 73, 75, 77, 85, 86];
const isSnowing = snowCodes.includes(currentData?.weatherCode);

  const lastSearchedCity = useRef('');


  const isCacheValid = (timestamp) => {
    const thirtyMinutesInMs = 30 * 60 * 1000;
    return Date.now() - timestamp < thirtyMinutesInMs;
  };


  const getCachedWeatherData = (city) => {
    try {
      const cacheKey = `weather_${city.toLowerCase().trim()}`;
      const cachedData = localStorage.getItem(cacheKey);
      
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      
      if (isCacheValid(timestamp)) {
        return data;
      } else {
    
        localStorage.removeItem(cacheKey);
        return null;
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

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
  if (city === lastSearchedCity.current) return;
  lastSearchedCity.current = city;
  setCityName(city);

  const cachedWeatherData = getCachedWeatherData(city);
  if (cachedWeatherData) {
    const { currentData: cachedCurrentData, hourlyForecast: cachedHourlyForecast, forecastData: cachedForecastData } = cachedWeatherData;
    setCurrentData(cachedCurrentData);
    setHourlyForecast(cachedHourlyForecast);
    setForecastData(cachedForecastData);
    return;
  }

  try {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
    if (!apiKey) return alert('API key is missing');

    const geocodeResp = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geo = geocodeResp.data?.results?.[0];
    if (!geo) return alert("Location not found");

    const { latitude, longitude, name } = geo;

    
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,pressure_msl,visibility&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`;
    const weatherResp = await axios.get(weatherUrl);
    const data = weatherResp.data;

    const current = data.current;
    const hourly = data.hourly;
    const daily = data.daily;

    const currentWeatherData = {
      temperature: Math.floor(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      windDirection: current.wind_direction_10m,
      pressure: current.pressure_msl,
      visibility: current.visibility,
      icon: weatherCodeIcons[current.weather_code] || sunny,
      location: name,
      temperatureMin: Math.floor(daily.temperature_2m_min[0]),
      temperatureMax: Math.floor(daily.temperature_2m_max[0]),
      uvIndex: 0, 
      weatherCode: current.weather_code
    };

    const hourlyData = hourly.time.slice(0, 12).map((time, i) => ({
      time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.floor(hourly.temperature_2m[i]),
      icon: weatherCodeIcons[hourly.weather_code[i]] || sunny,
      humidity: hourly.relative_humidity_2m[i],
      windSpeed: hourly.wind_speed_10m[i],
      weatherCode: hourly.weather_code[i]
    }));

    const dailyData = daily.time.map((date, i) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      temperature: Math.floor(daily.temperature_2m_max[i]),
      temperatureMin: Math.floor(daily.temperature_2m_min[i]),
      humidity: null,
      windSpeed: null,
      icon: weatherCodeIcons[daily.weather_code[i]] || sunny,
      precipitation: daily.precipitation_sum[i],
      weatherCode: daily.weather_code[i]
    }));

    setCurrentData(currentWeatherData);
    setHourlyForecast(hourlyData);
    setForecastData(dailyData);

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
;

  useEffect(() => {
    if (location?.city) {
      search(location.city)
    }
  }, [location?.city])

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
 <div
  ref={weatherRef}
  className={`min-h-[200vh] transition-colors duration-500 ${
    darkMode
      ? 'bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-900 text-white'
      : 'bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 text-white'
  }`}
>
  {darkMode && (
    <div className="flex justify-center">
      <div
        ref={spaceRef}
        className="absolute w-[200px] h-[250px] xs:w-[250px] xs:h-[300px] sm:w-[650px] sm:h-[750px] md:w-[450px] md:h-[550px] lg:w-[600px] lg:h-[750px] xl:w-[700px] xl:h-[850px]"
      >
        <Lottie
          animationData={space}
          loop
          autoplay
          style={{ height: "140%", width: "140%" }}
        />
      </div>
    </div>
  )}

  {!darkMode && (
    <div ref={bearScrollRef} className="absolute w-auto h-auto flex align-middle">
      <div ref={bearRef} className="w-[150px] h-[230px] xs:w-[250px] xs:h-[350px] sm:w-[300px] sm:h-[420px] md:w-[350px] md:h-[490px] absolute">
        <Lottie
          animationData={flyingBear}
          loop={true}
          autoplay={true}
          style={{ width: "200%", height: "260%" }}
        />
      </div>
    </div>
  )}

  <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-4 xs:py-6 sm:py-8 relative z-10">
    <div className="flex  flex-row xs:flex-row justify-between items-center mb-4 xs:mb-6 sm:mb-8 gap-4 xs:gap-0">
      <div className="relative w-full h-full max-w-xs xs:max-w-sm sm:max-w-md">
        <input
          onKeyDown={handleKeyDown}
          onChange={handleSearchInputChange}
          ref={inputRef}
          type="text"
          placeholder="Search city..."
          className="w-full p-3 xs:p-4 pl-10 xs:pl-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 shadow-lg text-sm xs:text-base"
        />
        <img
          src={serch_icon}
          alt="Search"
          className="absolute left-3 xs:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 opacity-70 cursor-pointer hover:opacity-100 transition-opacity"
          onClick={() => search(searchQuery)}
        />
      </div>

      <div className="flex gap-2">
        <button
          className="p-2 xs:p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 text-white shadow-lg text-lg xs:text-xl"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>

    {currentData ? (
      <div className="space-y-4 xs:space-y-6 sm:space-y-8">
        {isRainy && <RainScene />}
        {isSnowing && <SnowScene />}
        <div
          ref={currentWeatherRef}
          className="bg-white/20 backdrop-blur-md rounded-2xl xs:rounded-3xl p-4 xs:p-6 sm:p-8 shadow-xl transform hover:scale-[1.02] transition-transform duration-300"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-xl xs:text-2xl sm:text-3xl opacity-80">📍{cityname}</p>
              <p className="text-sm xs:text-lg sm:text-xl ml-0 md:ml-4 opacity-80">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center">
              <img
                src={currentData.icon}
                alt="Current"
                className="weather-icon w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mr-2 xs:mr-4"
              />
              <div>
                <p className="temperature-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold">
                  {currentData.temperature}°C
                </p>
                <div className="flex gap-2 xs:gap-4 text-sm xs:text-base sm:text-lg">
                  <span>H: {currentData.temperatureMax}°</span>
                  <span>L: {currentData.temperatureMin}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          ref={weatherDetailsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 sm:gap-4 weather-data"
        >
          {[
            {
              label: "Humidity",
              value: `${currentData.humidity}%`,
              icon: humidity,
            },
            {
              label: "Wind Speed",
              value: `${currentData.windSpeed}km/hr`,
              icon: wind,
            },
            { label: "UV Index", value: currentData.uvIndex, icon: uv },
            {
              label: "Wind Direc.",
              value: `${currentData.windDirection}°`,
              icon: wd,
            },
            {
              label: "Pressure",
              value: `${currentData.pressure} hPa`,
              icon: ap,
            },
            {
              label: "Visibility",
              value: `${currentData.visibility} km`,
              icon: vv,
            },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handleDataClick(item.label, item.value, item.icon)}
              className="p-2 xs:p-3 sm:p-4 rounded-xl xs:rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:bg-white/30 hover:backdrop-blur-lg hover:border-white/40"
            >
              <div className="flex items-center mb-1 xs:mb-2">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 mr-1 xs:mr-2"
                />
                <h4 className="font-medium text-white text-xs xs:text-sm sm:text-base">{item.label}</h4>
              </div>
              <p className="text-lg xs:text-xl sm:text-2xl font-bold text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div
          ref={hourlyForecastRef}
          className="bg-white/20 backdrop-blur-md rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 shadow-xl overflow-hidden"
        >
          <h3 className="text-xl xs:text-2xl font-bold mb-3 xs:mb-4">Hourly Forecast</h3>
          <div className="overflow-hidden">
            <div ref={hourlyScrollerRef} className="flex gap-2 xs:gap-3 sm:gap-4 pb-4">
              {visibleHourly.map((hour, index) => (
                <div
                  key={index}
                  className="hourly-card flex-shrink-0 w-24 xs:w-28 sm:w-32 p-2 xs:p-3 sm:p-4 rounded-xl xs:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-lg transform hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-sm xs:text-base sm:text-lg font-medium mb-1 xs:mb-2">{hour.time}</p>
                  <img
                    src={hour.icon}
                    alt="weather"
                    className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 mx-auto my-1 xs:my-2"
                  />
                  <p className="text-lg xs:text-xl sm:text-2xl font-bold">{hour.temperature}°C</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-3 xs:mt-4 gap-2">
            <button
              onClick={handlePrev}
              disabled={hourStartIndex === 0}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 disabled:opacity-50 shadow-lg text-lg xs:text-xl"
            >
              ‹
            </button>
            <button
              onClick={handleNext}
              disabled={hourStartIndex + hoursPerSlide >= hourlyForecast.length}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 disabled:opacity-50 shadow-lg text-lg xs:text-xl"
            >
              ›
            </button>
          </div>
        </div>

        <div
          ref={weeklyForecastRef}
          className="bg-white/20 backdrop-blur-md rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 shadow-xl overflow-hidden"
        >
          <h3 className="text-xl xs:text-2xl font-bold mb-3 xs:mb-4">7-Day Forecast</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 xs:gap-3 sm:gap-4">
            {forecastData.map((day, index) => (
              <div
                key={index}
                className="weekly-card p-3 xs:p-4 rounded-xl xs:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <div className="text-center">
                  <p className="text-sm xs:text-base sm:text-lg font-medium mb-1 xs:mb-2">{day.date}</p>
                  <img
                    src={day.icon}
                    alt="weather"
                    className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 mx-auto my-1 xs:my-2"
                  />
                  <div className="flex justify-center items-center gap-1 xs:gap-2">
                    <p className="text-lg xs:text-xl sm:text-2xl font-bold">{day.temperature}°</p>
                    <p className="text-sm xs:text-base sm:text-lg opacity-80">{day.temperatureMin}°</p>
                  </div>
                  <div className="mt-1 xs:mt-2 flex flex-col xs:flex-row justify-center items-center gap-1 xs:gap-2 text-xs xs:text-sm">
                    <span className="flex items-center">
                      <img
                        src={humidity}
                        alt="humidity"
                        className="w-3 h-3 xs:w-4 xs:h-4 mr-1"
                      />
                      {day.humidity}%
                    </span>
                    <span className="flex items-center">
                      <img src={wind} alt="wind" className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                      {day.windSpeed} km/h
                    </span>
                  </div>
                  {day.precipitation > 0 && (
                    <div className="mt-1 xs:mt-2 text-xs xs:text-sm text-blue-300">
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
      <div className="text-center p-8 xs:p-10 sm:p-12 bg-white/20 backdrop-blur-md rounded-2xl xs:rounded-3xl shadow-xl">
        <p className="text-lg xs:text-xl sm:text-2xl">Enter a city name to get started</p>
      </div>
    )}
  </div>

  <Modal show={showModal} onClose={handleCloseModal}>
    {selectedDetail && (
      <div
        className={`p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } shadow-2xl max-w-xs xs:max-w-sm mx-auto`}
      >
        <h3 className="text-lg xs:text-xl font-semibold mb-3 xs:mb-4">{selectedDetail.label}</h3>
        <img src={selectedDetail.icon} alt="" className="w-10 h-10 xs:w-12 xs:h-12 mb-3 xs:mb-4" />
        <p className="text-xl xs:text-2xl font-bold">{selectedDetail.value}</p>
      </div>
    )}
  </Modal>
</div>
  )
}

export default Weather;