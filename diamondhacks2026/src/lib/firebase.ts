import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_KEY,
  authDomain: "studyspotter-941b7.firebaseapp.com",
  projectId: "studyspotter-941b7",
  storageBucket: "studyspotter-941b7.firebasestorage.app",
  messagingSenderId: "739812798266",
  appId: "1:739812798266:web:b4183409dddbc45792ea03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


//next themes, react day picker