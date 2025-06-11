import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import profile from './../assets/propic.jpg';
import profile2 from './../assets/lily.jpg';
import profile3 from './../assets/pic3.jpg';
import profile4 from './../assets/pic4.jpg';
import logo from './../assets/mmm_logo.jpg';
import inst from './../assets/inst.png';
import tele from './../assets/tele.jpg';
import link from './../assets/link.jpg';
import twit from './../assets/twit.png';

const creators = [
  {
    name: "Pranshul Mishra",
    image: profile,
    role: "Backend Developer",
    branch: "Electronics and Communication Engineering (ECE)",
    bio: "Handles APIs, databases and authentication.",
    more: "Experienced with Node.js, Express, and SQL. Manages secure and scalable backend infrastructure.",
  },
  {
    name: "Aditi Pandey",
    image: profile2,
    role: "Frontend Developer",
    branch: "Computer Science Engineering (CSE)",
    bio: "Loves building beautiful UIs with React.",
    more: "Expert in GSAP, animation logic, and accessibility standards. Passionate about clean code and design systems.",
  },
  {
    name: "Ujjwal Kumar",
    image: profile3,
    role: "UI/UX Designer",
    branch: "Information Technology Engineering (IT)",
    bio: "Designs clean and intuitive user interfaces.",
    more: "Skilled in Figma, Adobe XD, and user research. Brings empathy into every screen and pixel.",
  },
  {
    name: "Siddhi Mishra",
    image: profile4,
    role: "Project Manager",
    branch: "Electronics and Communication Engineering (ECE)",
    bio: "Ensures smooth collaboration and deadlines.",
    more: "Organized sprints, handled client meetings, and used Agile methodology to keep the team on track.",
  },
];
const About = () => {

  const navigate = useNavigate();

  const [openStates, setOpenStates] = useState(Array(creators.length).fill(false));

  const toggleMore = (index) => {
    setOpenStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index]; 
      return newStates;
    });
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center 
      bg-gradient-to-br from-blue-50 to-blue-100 
      dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-500">

      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        _ . . . About the Creators . . . _
      </h1>

      <p className="text-center max-w-2xl text-gray-700 dark:text-gray-300 mb-10">
        Hi! We are the developers of this weather app. Built with React, GSAP,
        Tomorrow.io API, and a passion for clean UI. We hope you enjoy using it!
      </p>

      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        (Batch '28)
      </h1>
      <a href="https://mmmut.xyz/" target="blank"><img src={logo} width={150} height={150} className="rounded-full transition-all duration-300 transform hover:scale-115  border-2 border-transparent dark:hover:border-blue-400">
      </img></a>
      <br></br> <p className="text-xl text-center max-w-2xl text-blue-800 dark:text-blue-300 font-medium mb-6">
        We are proud members of <span className="font-bold">MMMUT RESO</span>, dedicated to innovation and teamwork.
      </p>


      <div className="flex flex-wrap items-start justify-center gap-8">
        {creators.map((creator, index) => (
          <div
            key={index}
            className="bg-white h-auto dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-72 flex flex-col items-center text-center 
              transition-all duration-300 transform hover:scale-105 
              border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400"
          >
            <img
              src={creator.image}
              alt={creator.name}
              className="w-28 h-28 rounded-full object-cover shadow-lg mb-4"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {creator.name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{creator.role}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{creator.bio}</p>

            {openStates[index] && (
              <>
                <p className="text-sm mt-2 text-gray-600 dark:text-green-200">
                  Branch: {creator.branch}
                </p>
                <p className="text-sm mt-2 text-gray-600 dark:text-gray-200">
                  {creator.more}
                </p>
              </>
            )}

            <button
              onClick={() => toggleMore(index)}
              className="mt-3 text-blue-500 dark:text-blue-300 hover:underline text-sm"
            >
             {openStates[index] ? "Show Less" : "Read More"}

            </button>
          </div>
        ))}
      </div>
      <br></br>
      <br></br>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
        Contacts
      </h1>
      <div className="flex flex-wrap justify-center gap-8">
        <a href="https://www.instagram.com/mmmut.xyz/" target="blank"><img src={inst} width={70} height={70} className="rounded-full transition-all duration-300 transform hover:scale-115  border-2 border-transparent dark:hover:border-blue-400" /></a>
        <a href="https://mmmut.xyz/" target="blank"><img src={tele} width={80} height={80} className="rounded-full transition-all duration-300 transform hover:scale-115  border-2 border-transparent dark:hover:border-blue-400 " /></a>
        <a href="https://www.linkedin.com/company/mmmut/posts/?feedView=all" target="blank"><img src={link} width={70} height={70} className="rounded-full transition-all duration-300 transform hover:scale-115  border-2 border-transparent dark:hover:border-blue-400" /></a>
        <a href="https://mmmut.xyz/" target="blank"><img src={twit} width={70} height={70} className="rounded-full transition-all duration-300 transform hover:scale-115  border-2 border-transparent dark:hover:border-blue-400" /></a>

      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-300"
      >
        Return Home
      </button>

    </div>
  );
};

export default About;
