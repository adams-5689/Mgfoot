// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHLmueQRPeXOlnF4G1SdeFsB1F3s0TELM",
  authDomain: "magicfoot-d82d1.firebaseapp.com",
  projectId: "magicfoot-d82d1",
  storageBucket: "magicfoot-d82d1.firebasestorage.app",
  messagingSenderId: "840689786291",
  appId: "1:840689786291:web:991170de9b1450d4c63fc6",
  measurementId: "G-BED5S6DQHX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
