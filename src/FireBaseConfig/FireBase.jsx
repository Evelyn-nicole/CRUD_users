// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJaO8pMp6B6E3TiIWicMKUZ5XL_TSGimM",
  authDomain: "evaluacion-e05b8.firebaseapp.com",
  projectId: "evaluacion-e05b8",
  storageBucket: "evaluacion-e05b8.appspot.com",
  messagingSenderId: "1094685051815",
  appId: "1:1094685051815:web:8bc553126669afcd794482",
  measurementId: "G-DH3ZNY3PX5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app); // Inicializa Firestore para manejar la base de datos
export const auth = getAuth(app); // Inicializa Auth para manejar la autenticación

// initializeApp: Se usa para inicializar la aplicación de Firebase con una configuración específica.
// getAnalytics: Se usa para habilitar Google Analytics en la aplicación.
// getFirestore: Se usa para trabajar con Firestore, la base de datos de Firebase.
// getAuth: Se usa para manejar la autenticación de usuarios en Firebase.