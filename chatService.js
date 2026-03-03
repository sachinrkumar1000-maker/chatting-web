import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* ========================= */
/* FIND USER BY EMAIL */
/* ========================= */
export async function findUserByEmail(email) {
  email = email.trim().toLowerCase();

  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return snapshot.docs[0];
}

/* ========================= */
/* ADD CONTACT */
/* ========================= */
export async function addContact(contactUid) {
  const currentUid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", currentUid, "contacts", contactUid),
    {
      addedAt: serverTimestamp()
    }
  );
}

/* ========================= */
/* LIST CONTACTS */
/* ========================= */
export function listenToContacts(callback) {
  const currentUid = auth.currentUser.uid;

  const q = query(
    collection(db, "users", currentUid, "contacts"),
    orderBy("addedAt", "desc")
  );

  return onSnapshot(q, async (snapshot) => {

    const contacts = [];

    for (const docSnap of snapshot.docs) {
      const userDoc = await getDoc(doc(db, "users", docSnap.id));
      if (userDoc.exists()) {
        contacts.push({
          uid: docSnap.id,
          ...userDoc.data()
        });
      }
    }

    callback(contacts);
  });
}

/* ========================= */
/* CREATE OR GET CHAT */
/* ========================= */
export async function createOrGetChat(otherUserId) {
  const currentUserId = auth.currentUser.uid;

  const chatId = [currentUserId, otherUserId].sort().join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }

  return chatId;
}

/* ========================= */
/* SEND MESSAGE */
/* ========================= */
export async function sendMessage(chatId, text) {
  if (!text.trim()) return;

  await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
      senderId: auth.currentUser.uid,
      text,
      createdAt: serverTimestamp()
    }
  );

  await setDoc(
    doc(db, "chats", chatId),
    {
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

/* ========================= */
/* LISTEN TO MESSAGES */
/* ========================= */
export function listenToMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt")
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    callback(messages);
  });
}
