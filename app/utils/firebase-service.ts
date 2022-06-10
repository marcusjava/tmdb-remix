import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

//CLIENTE!!!!!!!!!!!

// Your web app's Firebase configuration
const firebaseConfig = { ...require("../../firebase.config.json") };

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

console.log("FIREBASE CLIENT INITIALIZED!!!!!");

const auth = getAuth(getApp());
const db = getFirestore(getApp());

export { auth, db };
