import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaRobot } from "react-icons/fa";
import ChatBot from './Chatbot';
import { getWeatherSummary } from './weatherAPI';

const ChatBotWrapper = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleUnauthorizedClick = () => {
    alert("⚠️ Please login to use the chatbot.");
    setShowLoginModal(true);
  };

  // Close login modal when user gets authenticated
  useEffect(() => {
    if (isAuthenticated && showLoginModal) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated, showLoginModal]);

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        {isAuthenticated ? (
          <div className="rounded-full shadow-lg transition-all duration-300">
            <ChatBot getWeatherSummary={getWeatherSummary} />
          </div>
        ) : (
          <button
            onClick={handleUnauthorizedClick}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-200 active:scale-95"
          >
            Chatbot💬
          </button>
        )}
      </div>

      {/* Login Modal */}
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
                  <FaRobot className="text-2xl text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  ChatBot Access Required
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please log in to use our AI-powered weather chatbot
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
    </>
  );
};

export default ChatBotWrapper;