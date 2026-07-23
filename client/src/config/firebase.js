import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDk37ZOO7p8x-U6fN-RP5PZj9HRIxQJ5M",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "erp-crm-7109e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "erp-crm-7109e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "erp-crm-7109e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "754097600457",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:754097600457:web:ee0b6827fe99a200315a18",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-T9VJ0Y5WQ4",
};

let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

export { firebaseApp, firebaseAuth, googleProvider, firebaseConfig };
