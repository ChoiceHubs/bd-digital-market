import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCsyxq8gRFJ0SauSdLzex6OxrLVcOFAvNo",
  authDomain: "bd-digital-market.firebaseapp.com",
  databaseURL: "https://bd-digital-market-default-rtdb.firebaseio.com",
  projectId: "bd-digital-market",
  storageBucket: "bd-digital-market.firebasestorage.app",
  messagingSenderId: "1025088935902",
  appId: "1:1025088935902:web:26dd08543222808de8ef4f",
  measurementId: "G-Q97P64T6EZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);