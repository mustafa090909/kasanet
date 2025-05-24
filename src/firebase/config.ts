import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBAszHKUB6VDKVow10WhUFzQLcF_1nU8ag",
  authDomain: "kasanet-11026.firebaseapp.com",
  projectId: "kasanet-11026",
  storageBucket: "kasanet-11026.firebasestorage.app",
  messagingSenderId: "6095049085",
  appId: "1:6095049085:web:2e0de5c3d16cba5be2bc14",
  measurementId: "G-51E7F8S8K2"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);