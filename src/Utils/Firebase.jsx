import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  
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
