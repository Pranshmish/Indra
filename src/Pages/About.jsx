import React from "react";
import profile from './../assets/propic.jpg';
import profile2 from './../assets/lily.jpg';
import profile3 from './../assets/pic3.jpg';
import profile4 from './../assets/pic4.jpg';

const creators = [
  { name: "Pranshul Mishra", image: profile },
  { name: "Aditi Pandey", image: profile2 },
  { name: "Ujjwal Kumar", image: profile3 },
  { name: "Siddhi Mishra", image: profile4 },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        About the Creators
      </h1>
      <p className="text-center max-w-2xl text-gray-700 dark:text-gray-300 mb-10">
        Hi! We are the developers of this weather app. Built with React, GSAP,
        Tomorrow.io API, and a passion for clean UI. We hope you enjoy using it!
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {creators.map((creator, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-60 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={creator.image}
              alt={creator.name}
              className="w-28 h-28 rounded-full object-cover shadow-lg mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {creator.name}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
