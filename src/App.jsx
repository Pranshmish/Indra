import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/SignUp";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import About from "./Pages/About";
import News from "./components/News";
import ChatBotWrapper from './components/ChatBotWrapper';
import { getWeatherSummary } from './components/weatherAPI';

function AppRoutes({ isAuthenticated, setIsAuthenticated }) {
  const location = useLocation();

  return (
    <>
    <Routes>
  {/* Homepage accessible to everyone */}
  <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route
    path="/login"
    element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
  />
  {/* These routes require authentication */}
  <Route
    path="/home"
    element={<Home isAuthenticated={isAuthenticated} />}
  />
  <Route
    path="/profile"
    element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
  />
  <Route
    path="/news"
    element={isAuthenticated ? <News /> : <Navigate to="/login" />}
  />
  <Route
    path="/about"
    element={isAuthenticated ? <About /> : <Navigate to="/login" />}
  />
</Routes>

      {/* ✅ Hide chatbot on /login and /signup */}
      {!["/login", "/signup"].includes(location.pathname) && (
        <ChatBotWrapper isAuthenticated={isAuthenticated} />
      )}
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
}

export default App;