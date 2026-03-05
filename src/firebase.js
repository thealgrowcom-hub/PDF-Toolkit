import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZHrMwFD6HCq55m-kS_xeh-xliJ5zNXFs",
    authDomain: "pdf-toolkit-c736d.firebaseapp.com",
    projectId: "pdf-toolkit-c736d",
    storageBucket: "pdf-toolkit-c736d.firebasestorage.app",
    messagingSenderId: "425643072422",
    appId: "1:425643072422:web:1ace0b2413276aaecacd67",
    measurementId: "G-11KE2PK401"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
