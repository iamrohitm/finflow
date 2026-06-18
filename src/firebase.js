// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ4pSHqxagfbsbGKszPyxqHMXHAujgVWw",
  authDomain: "finflow-f1dee.firebaseapp.com",
  projectId: "finflow-f1dee",
  storageBucket: "finflow-f1dee.firebasestorage.app",
  messagingSenderId: "415265252763",
  appId: "1:415265252763:web:5d952478f7f53af28bad3e",
  measurementId: "G-T6Y98CXD3Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };