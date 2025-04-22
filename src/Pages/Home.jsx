import React, { useState, useEffect, useRef } from "react";
import Weather from "../components/Weather";
import { gsap } from "gsap";
import { SearchLocationProvider } from "../components/SearchLocation";
import { LocationProvider } from "../components/Location";

const Home = () => {
  const butRef = useRef();
  const [cityTabs, setCityTabs] = useState([
    { name: "Current Location", value: "current" }
  ]);
  const [selectedCity, setSelectedCity] = useState("current");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    if (sidebarOpen) {
      
      gsap.to(".sidebar", {
        x: 0, 
        duration: 0.5,
        ease: "power2.out"
      });

      
      gsap.to(butRef.current, {
        opacity: 0, 
        x: 300, 
        duration: 0.8,
        ease: "power4.in"
      });
    } else {
      
      gsap.to(".sidebar", {
        x: "-100%", 
        duration: 0.5,
        ease: "power2.in"
      });

      
      gsap.to(butRef.current, {
        opacity: 1, 
        x: 0, 
        duration: 1,
        ease: "power2.in"
      });
    }
  }, [sidebarOpen]);

  const addCityTab = (e) => {
    e.preventDefault();
    const trimmedCity = newCity.trim();
    if (trimmedCity && !cityTabs.find(tab => tab.value.toLowerCase() === trimmedCity.toLowerCase())) {
      setCityTabs([...cityTabs, { name: trimmedCity, value: trimmedCity }]);
      setSelectedCity(trimmedCity);
      setNewCity("");
      setSidebarOpen(false);
    }
  };

 
  const handleSidebarButtonClick = () => {
    setSidebarOpen(prevState => !prevState);
  };

  return (
    <SearchLocationProvider>
      <LocationProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <button
            ref={butRef}
            className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 text-gray-800 dark:text-white"
            onClick={handleSidebarButtonClick}
          >
            ☰
          </button>

          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} z-40`}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">City Tabs</h3>
              <div className="space-y-2">
                {cityTabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-300 ${
                      tab.value === selectedCity
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => {
                      setSelectedCity(tab.value);
                      setSidebarOpen(false);
                    }}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
              <form onSubmit={addCityTab} className="mt-6">
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="mt-2 w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                >
                  ➕ Add City
                </button>
              </form>
            </div>
          </div>

          <div className="transition-all duration-300">
            <Weather city={selectedCity} />
          </div>
        </div>
      </LocationProvider>
    </SearchLocationProvider>
  );
};

export default Home;
