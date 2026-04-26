import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDLRDxcnKL72H07ZykUCfXBUMcDz4NtI8c",
  authDomain: "forge-trainer.firebaseapp.com",
  projectId: "forge-trainer",
  storageBucket: "forge-trainer.firebasestorage.app",
  messagingSenderId: "1068656315822",
  appId: "1:1068656315822:web:7e3e3ea78a66f0ef1b0c3f",
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
