// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

apiKey = import.meta.env.VITE_FIREBASE_KEY;
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "readysetpdf.firebaseapp.com",
  projectId: "readysetpdf",
  storageBucket: "readysetpdf.firebasestorage.app",
  messagingSenderId: "169711837230",
  appId: "1:169711837230:web:5d6b208b2e283e963bbfbf",
  databaseURL:
    "https://readysetpdf-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database };
