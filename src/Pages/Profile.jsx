// src/Pages/Profile.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import p from './../assets/gojo.jpg'

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 dark:from-gray-900 dark:to-gray-700">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg w-96 p-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Profile
        </h2>

        {user ? (
          <div className="text-center">
            <img src={p} height={200} width={200} className="rounded-full border-2 border-blue mx-auto"></img>
            <p className="text-xl text-gray-700 dark:text-gray-200">
              Welcome back, <span className="font-bold">{user.email}</span>!
            </p>
            <div className="mt-6">
              <button
                onClick={handleLogout}
                className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-red-500 font-semibold">You are not logged in!</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
