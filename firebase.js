// Firebase v12 Modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVn1UZp3v-2X9v23o4jIot46TlaZZQ0jU",
  authDomain: "axoncord-d8dcd.firebaseapp.com",
  projectId: "axoncord-d8dcd",
  storageBucket: "axoncord-d8dcd.firebasestorage.app",
  messagingSenderId: "514941956089",
  appId: "1:514941956089:web:430afa28fb7bc0e9975728"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

export { auth, db, provider };
