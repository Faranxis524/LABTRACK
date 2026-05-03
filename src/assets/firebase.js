import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration. Set VITE_* environment variables in production.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDpZ-MRR2U2fay7aJ78TafZT0MXDrPauZo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "labtracking-8861f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "labtracking-8861f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "labtracking-8861f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "792374575763",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:792374575763:web:a0ae9322a4f096f12f0366",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QRK3ZTDHN0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()