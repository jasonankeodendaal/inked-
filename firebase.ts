import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// --- PASTE YOUR FIREBASE CONFIGURATION HERE ---
// Follow the guide to get this from your Firebase project settings.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR-PROJECT-ID.firebaseapp.com",
  projectId: "YOUR-PROJECT-ID",
  storageBucket: "YOUR-PROJECT-ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore database instance
export const db = getFirestore(app);
