// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd_VzwTA7oeJ2AgpdjCq5O96lBySOXEFU",
  authDomain: "eeeproject-d9205.firebaseapp.com",
  databaseURL: "https://eeeproject-d9205-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "eeeproject-d9205",
  storageBucket: "eeeproject-d9205.firebasestorage.app",
  messagingSenderId: "199042106751",
  appId: "1:199042106751:web:72ffcd900383ddc162464a",
  measurementId: "G-GLYXZCCBWK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);