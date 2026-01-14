import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGoVK-Kupa5fsxujynso1kBPpKxT7zZKU",
  authDomain: "sararamos-d0fc0.firebaseapp.com",
  projectId: "sararamos-d0fc0",
  storageBucket: "sararamos-d0fc0.firebasestorage.app",
  messagingSenderId: "501406187816",
  appId: "1:501406187816:web:ee307125a4db891a3c501d",
  measurementId: "G-STGZ8RTDZW"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

let analytics;
// Analytics only works on client side
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
