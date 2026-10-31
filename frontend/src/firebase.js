import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4cX5MszSuz31b4jltWw2qMbMeIMMJ-ww",
  authDomain: "locksy-eccc1.firebaseapp.com",
  projectId: "locksy-eccc1",
  storageBucket: "locksy-eccc1.firebasestorage.app",
  messagingSenderId: "674813293404",
  appId: "1:674813293404:web:229899a97c27b941e24799"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
