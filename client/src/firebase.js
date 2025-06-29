// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "easyhomes-real-estate.firebaseapp.com",
  projectId: "easyhomes-real-estate",
  storageBucket: "easyhomes-real-estate.appspot.com",
  messagingSenderId: "715901467439",
  appId: "1:715901467439:web:70392d508a9df7114effda",
  measurementId: "G-Q7037P1ENR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);