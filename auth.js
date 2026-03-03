import { auth, provider } from "./firebase.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

/* ============================= */
/* GOOGLE LOGIN */
/* ============================= */

export async function loginWithGoogle() {
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "index.html";
  } catch (error) {
    console.error("Login Error:", error.message);
  }
}

/* ============================= */
/* LOGOUT */
/* ============================= */

export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
}

/* ============================= */
/* PROTECT PAGE (Require Login) */
/* ============================= */

export function protectPage() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
    }
  });
}

/* ============================= */
/* BYPASS LOGIN PAGE */
/* ============================= */

export function bypassIfLoggedIn() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "index.html";
    }
  });
}

/* ============================= */
/* GET CURRENT USER (Optional) */
/* ============================= */

export function getCurrentUser() {
  return auth.currentUser;
}
