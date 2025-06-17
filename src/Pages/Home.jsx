import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Weather from "../components/Weather";
import { gsap } from "gsap";
import { SearchLocationProvider } from "../components/SearchLocation";
import { LocationProvider } from "../components/Location";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaInfoCircle,
  FaSignOutAlt,
  FaNewspaper,
  FaCog,
  FaCity,
  FaMapMarkerAlt,
  FaPlus,
  FaChevronDown,
  FaChevronUp,
  FaSignInAlt,
} from "react-icons/fa";

const Home = ({ isAuthenticated = false, onLogout }) => {
  const navigate = useNavigate();
  const butRef = useRef();
  const [cityTabs, setCityTabs] = useState([
    { name: "Current Location", value: "current" },
  ]);
  const [selectedCity, setSelectedCity] = useState("current");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newCity, setNewCity] = useState("");
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [showAddedCities, setShowAddedCities] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      gsap.to(".sidebar", { x: 0, duration: 0.5, ease: "power2.out" });
      gsap.to(butRef.current, {
        opacity: 0,
        x: 300,
        duration: 0.8,
        ease: "power4.in",
      });
    } else {
      gsap.to(".sidebar", { x: "-100%", duration: 0.5, ease: "power2.in" });
      gsap.to(butRef.current, {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.in",
      });
    }
  }, [sidebarOpen]);

  const addCityTab = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to add a city.");
      setShowLoginModal(true);
      return;
    }

    const trimmedCity = newCity.trim();
    if (
      trimmedCity &&
      !cityTabs.find(
        (tab) => tab.value.toLowerCase() === trimmedCity.toLowerCase()
      )
    ) {
      setCityTabs([...cityTabs, { name: trimmedCity, value: trimmedCity }]);
      setSelectedCity(trimmedCity);
      setNewCity("");
      setSidebarOpen(false);
      setShowAddedCities(true);
    }
  };

  const removeCityTab = (value) => {
    // Don't allow removing current location
    if (value === "current") return;
    setCityTabs(cityTabs.filter((tab) => tab.value !== value));

    // If removed city was selected, select current location
    if (selectedCity === value) {
      setSelectedCity("current");
    }
  };

  const handleSidebarButtonClick = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const handleNavigate = (path) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    
    setCityTabs([{ name: "Current Location", value: "current" }]);
    setSelectedCity("current");
    
    
    if (onLogout) {
      onLogout();
    }
    
  
    navigate("/login");
  };

  const handleLogin = () => {
    setSidebarOpen(false);
    navigate("/login");
  };


  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

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
            className={`fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl transform transition-transform duration-300 ease-in-out sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } z-40`}
          >
            <button
              className="absolute top-4 right-4 text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ×
            </button>

            <div className="pt-6 pb-6 px-6 flex flex-col h-full">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto pr-1">
                {/* City Tabs */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                    City Tabs
                    {cityTabs.length > 1 && (
                      <button
                        onClick={() => setShowAddedCities((prev) => !prev)}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        aria-label={
                          showAddedCities ? "Collapse city list" : "Expand city list"
                        }
                      >
                        {showAddedCities ? (
                          <>
                            Hide <FaChevronUp />
                          </>
                        ) : (
                          <>
                            Show <FaChevronDown />
                          </>
                        )}
                      </button>
                    )}
                  </h3>

                  
                  <button
                    key="current"
                    className={`w-full p-3 mb-2 rounded-lg text-left transition-all duration-300 flex items-center gap-3 ${selectedCity === "current"
                        ? "bg-blue-500 text-white shadow-md scale-[1.02]"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-lg hover:scale-[1.03]"
                      }`}
                    onClick={() => {
                      setSelectedCity("current");
                      setSidebarOpen(false);
                    }}
                  >
                    <FaMapMarkerAlt /> Current Location
                  </button>

                  
                  <AnimatePresence>
                    {showAddedCities &&
                      cityTabs
                        .filter((tab) => tab.value !== "current")
                        .map((tab) => (
                          <motion.div
                            key={tab.value}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <button
                              className={`w-full p-3 mb-2 rounded-lg text-left transition-all duration-300 flex items-center justify-between gap-3 ${selectedCity === tab.value
                                  ? "bg-blue-500 text-white shadow-md scale-[1.02]"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-lg hover:scale-[1.03]"
                                }`}
                              onClick={() => {
                                setSelectedCity(tab.value);
                                setSidebarOpen(false);
                              }}
                            >
                              <span className="flex items-center gap-2">
                                <FaCity />
                                {tab.name}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCityTab(tab.value);
                                }}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                aria-label={`Remove city ${tab.name}`}
                              >
                                ×
                              </span>
                            </button>
                          </motion.div>
                        ))}
                  </AnimatePresence>

               
                  <form onSubmit={addCityTab} className="mt-6">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter city name"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FaPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" />
                    </div>
                    <button
                      type="submit"
                      className="mt-2 w-full p-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                      <FaPlus /> Add City
                    </button>
                  </form>
                </div>
              </div>

             
              <div className="mt-6">
                <button
                  onClick={() => setMenuExpanded((prev) => !prev)}
                  className="w-full mb-2 p-3 flex items-center justify-between bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    <FaCog />
                    Menu Options
                  </span>
                  <motion.span
                    animate={{ rotate: menuExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    ▼
                  </motion.span>
                </button>

                <AnimatePresence>
                  {menuExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden space-y-2"
                    >
                      <button
                        className="w-full p-3 flex items-center gap-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                        onClick={() => navigate("/news")}
                      >
                        <FaNewspaper />
                        News
                      </button>

                      <button
                        onClick={() => handleNavigate("/profile")}
                        className="w-full p-3 flex items-center gap-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all duration-300"
                      >
                        <FaUser />
                        Profile
                      </button>

                      <button
                        onClick={() => handleNavigate("/about")}
                        className="w-full p-3 flex items-center gap-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
                      >
                        <FaInfoCircle />
                        About
                      </button>
                      
                      {isAuthenticated ? (
                        <button
                          onClick={handleLogout}
                          className="w-full p-3 flex items-center gap-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      ) : (
                        <button
                          onClick={handleLogin}
                          className="w-full p-3 flex items-center gap-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-300"
                        >
                          <FaSignInAlt />
                          Login
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="transition-all duration-300">
            <Weather city={selectedCity} />
          </div>

          <AnimatePresence>
            {showLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowLoginModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-8 m-4 max-w-md w-full shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUser className="text-2xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Login Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Please log in to add cities to your weather dashboard
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowLoginModal(false);
                          navigate("/login");
                        }}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <FaUser />
                        Login
                      </button>
                      <button
                        onClick={() => setShowLoginModal(false)}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      Don't have an account?{" "}
                      <button
                        onClick={() => {
                          setShowLoginModal(false);
                          navigate("/signup");
                        }}
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        Sign up here
                      </button>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LocationProvider>
    </SearchLocationProvider>
  );
};

export default Home;