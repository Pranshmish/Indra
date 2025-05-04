// components/weatherAPI.js
export const getWeatherSummary = async (city) => {
    const apiKey1 = import.meta.env.VITE_WEATHER_API_KEY; // ✅ correctly use env var
    const response = await fetch(
      `https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${apiKey1}`
    );
  
    const data = await response.json();
  
    if (data.code || !data.data) throw new Error("API error or invalid city.");
  
    const temp = data.data.values.temperature;
    const weatherCode = data.data.values.weatherCode;
    
    return `In ${city}, it's currently ${temp}°C with weather code ${weatherCode}.`;
  };
  