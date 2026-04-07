// Firebase initialization for Mela
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyCQ6cV7NsebjcUIjPxXyzUeBKuKX3vDDbU",
  authDomain: "mela-00000.firebaseapp.com",
  projectId: "mela-00000",
  storageBucket: "mela-00000.firebasestorage.app",
  messagingSenderId: "325112735749",
  appId: "1:325112735749:web:0facf9d591b17dfd3a546c",
  measurementId: "G-X863RXSFE8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = null;

