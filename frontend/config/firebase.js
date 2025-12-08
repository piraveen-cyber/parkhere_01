// Firebase core imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential
} from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjlb8jo027j-AzYoh3J5x3uuu7t1bHDFQ",
  authDomain: "auth-mern-2bf54.firebaseapp.com",
  projectId: "auth-mern-2bf54",
  storageBucket: "auth-mern-2bf54.firebasestorage.app",
  messagingSenderId: "748627945980",
  appId: "1:748627945980:web:411aa776005f79ba506a79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the authentication modules you need
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithCredential };
