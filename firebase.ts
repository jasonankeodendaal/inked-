import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJPiGbBs-T9Mj_wcvby-WtThkoZbDqUzU",
  authDomain: "inked-605f2.firebaseapp.com",
  projectId: "inked-605f2",
  storageBucket: "inked-605f2.firebasestorage.app",
  messagingSenderId: "738054676293",
  appId: "1:738054676293:web:6f64deb80ef981d67a282c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
