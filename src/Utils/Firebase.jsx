import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtwmm8ijYVds7GEcoJCmkqwgayKiHMMCA",
  authDomain: "rallyguessr-df26f.firebaseapp.com",
  projectId: "rallyguessr-df26f",
  storageBucket: "rallyguessr-df26f.firebasestorage.app",
  messagingSenderId: "508183936973",
  appId: "1:508183936973:web:240953a297859e21008e84",
  measurementId: "G-8Q82PTDZRK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const gProvider = new GoogleAuthProvider();
gProvider.setCustomParameters({ prompt: "select_account" });
const fProvider = new FacebookAuthProvider();
export const auth = getAuth();
export const signInWithGooglePopUp = () => signInWithPopup(auth, gProvider);
export const signInWithFacebookPopUp = () => signInWithPopup(auth, fProvider);
export const db = getFirestore(app);