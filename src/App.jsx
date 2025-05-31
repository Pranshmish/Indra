import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/SignUp";
import Home from "./Pages/Home";
import Profile from "./Pages/Profile";
import About from "./Pages/About"; 
import ChatBot from './components/Chatbot';
import { getWeatherSummary } from './components/weatherAPI';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("auth") === "true"
  );
  const [showChat, setShowChat] = useState(false);

  const toggleChat = () => {
    setShowChat(prev => !prev);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <SignupPage onSignup={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route 
        path="/login"
        element={
          <LoginPage/>
        }/>
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <>
                <Home />
                <button onClick={toggleChat} className="chat-toggle-btn">
                  {showChat ? 'Close Chat' : 'Open Chat'}
                </button>
                {showChat && <ChatBot getWeatherSummary={getWeatherSummary} />}
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
        />

        <Route
          path="/about"
          element={isAuthenticated ? <About /> : <Navigate to="/" />} // ✅ Protect the route
        />
      </Routes>
    </Router>
  );
}

export default App;
