// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXrWtCIEXb-ogoxMEBw1MqNYI_huK8pMA",
  authDomain: "bece-prep.firebaseapp.com",
  projectId: "bece-prep",
  storageBucket: "bece-prep.firebasestorage.app",
  messagingSenderId: "642051522009",
  appId: "1:642051522009:web:9bb8c6e17b0825d24bedc8",
  measurementId: "G-2DGFXK40PH"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(app);