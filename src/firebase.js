import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvw1-Oi3yNq9j7NsPbhUjGG75F-8WT6xo",
  authDomain: "indra-1.firebaseapp.com",
  projectId: "indra-1",
  storageBucket: "indra-1.firebasestorage.app",
  messagingSenderId: "855879323283",
  appId: "1:855879323283:web:c70921bccd44a96550c766",
  measurementId: "G-HPEF49LYZM"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
