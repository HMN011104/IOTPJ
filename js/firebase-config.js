import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCPIP1amZJ9qdyzkl8KnEb-myKbSD2vXMk",
  authDomain: "iot-control-system-c099c.firebaseapp.com",
  projectId: "iot-control-system-c099c",
  storageBucket: "iot-control-system-c099c.firebasestorage.app",
  messagingSenderId: "1036379941943",
  appId: "1:1036379941943:web:d0b14f43d48f99ce1223b2"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);