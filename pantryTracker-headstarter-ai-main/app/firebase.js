// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBExPsyaA2PKGjn1ZAln627QUK18ohFSmM",
  authDomain: "pantrytracker-main.firebaseapp.com",
  databaseURL: "https://pantrytracker-main-default-rtdb.firebaseio.com",
  projectId: "pantrytracker-main",
  storageBucket: "pantrytracker-main.appspot.com",
  messagingSenderId: "581442357057",
  appId: "1:581442357057:web:4233f766578a727cf043c0",
  measurementId: "G-MP2WPR5LFJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

let analytics;

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Export Firestore and Analytics instance (if available)
export { firestore, analytics };
