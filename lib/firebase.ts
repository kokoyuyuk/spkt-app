import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// KITA AKAN MASUKKAN KUNCI RAHSIA KAWAN DI SINI NANTI
const firebaseConfig = {
  apiKey: "AIzaSyCQXw1TGLn03WAXWGJL4I9FlUUje94TyNs",
  authDomain: "spkt-app.firebaseapp.com",
  projectId: "spkt-app",
  storageBucket: "spkt-app.firebasestorage.app",
  messagingSenderId: "454882255735",
  appId: "1:454882255735:web:132c6ef16ce05db3dc7772"
};

// Pastikan Firebase tidak dihidupkan berkali-kali (penting untuk Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };