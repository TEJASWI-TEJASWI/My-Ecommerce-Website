import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAvrIaTo8jP1eXXwC1jowcvzaIAyWiYM8",
  authDomain: "my-app-89efd.firebaseapp.com",
  projectId: "my-app-89efd",
  storageBucket: "my-app-89efd.appspot.com",
  messagingSenderId: "818581604050",
  appId: "1:818581604050:web:a9e0ada58550fe39bb0f0b",
  measurementId: "G-Q16M9S0MQX"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const analytics = firebase.analytics();
const auth = firebase.auth();

export { db, auth };
export default firebase

{/*
│   Serving!                                         │
│                                                    │
│   - Local:            http://localhost:5000        │
│   - On Your Network:  http://192.168.43.117:5000 
*/}