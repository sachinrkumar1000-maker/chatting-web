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

/* FIND USER BY EMAIL */
export async function findUserByEmail(email) {
  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  return snapshot.docs[0];
}

/* CREATE OR GET CHAT BETWEEN TWO USERS */
export async function createOrGetChat(otherUserId) {
  const currentUserId = auth.currentUser.uid;

  const chatId = [currentUserId, otherUserId].sort().join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      updatedAt: serverTimestamp()
    });
  }

  return chatId;
}

/* SEND MESSAGE */
export async function sendMessage(chatId, text) {
  await addDoc(
    collection(db, "chats", chatId, "messages"),
    {
      senderId: auth.currentUser.uid,
      text,
      createdAt: serverTimestamp()
    }
  );

  await setDoc(doc(db, "chats", chatId), {
    lastMessage: text,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

/* LISTEN TO CHAT MESSAGES */
export function listenToMessages(chatId, callback) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt")
  );

  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    callback(messages);
  });
}
