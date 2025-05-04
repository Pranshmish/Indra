// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDW9audA5ll8wDe9GlsVD-XyARvw2zUR4o",
  authDomain: "authentication-32d9a.firebaseapp.com",
  projectId: "authentication-32d9a",
  storageBucket: "authentication-32d9a.appspot.com", // FIXED .app → .app**spot**.com
  messagingSenderId: "839673378616",
  appId: "1:839673378616:web:c6990c26317e8cfabcf3cd",
  measurementId: "G-93W9WBRTYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Setup Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
