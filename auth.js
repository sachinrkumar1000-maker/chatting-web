import { auth, provider, db } from "./firebase.js";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* ========================= */
/* GOOGLE LOGIN */
/* ========================= */

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user to Firestore
    await setDoc(doc(db, "users", user.uid), {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp()
    }, { merge: true });

    window.location.href = "index.html";

  } catch (error) {
    console.error("Login Error:", error);
  }
}

/* ========================= */
/* LOGOUT */
/* ========================= */

export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

/* ========================= */
/* PAGE PROTECTION */
/* ========================= */

export function protectPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

/* ========================= */
/* LOGIN BYPASS */
/* ========================= */

export function bypassIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });
}

/* ========================= */
/* CURRENT USER */
/* ========================= */

export function getCurrentUser() {
  return auth.currentUser;
}
