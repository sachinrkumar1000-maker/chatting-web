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

/* FIND OR CREATE USER BY EMAIL */
export async function findOrCreateUserByEmail(email) {

  email = email.trim().toLowerCase();

  const q = query(
    collection(db, "users"),
    where("email", "==", email)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    return snapshot.docs[0];
  }

  // If user does not exist → create placeholder
  const fakeUid = crypto.randomUUID();

  await setDoc(doc(db, "users", fakeUid), {
    displayName: email.split("@")[0],
    email: email,
    photoURL: "",
    createdAt: serverTimestamp()
  });

  return await getDoc(doc(db, "users", fakeUid));
}

/* ADD CONTACT */
export async function addContact(contactUid) {
  const currentUid = auth.currentUser.uid;

  await setDoc(
    doc(db, "users", currentUid, "contacts", contactUid),
    {
      addedAt: serverTimestamp()
    }
  );
}

/* LIST CONTACTS */
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

/* CREATE OR GET CHAT */
export async function createOrGetChat(otherUserId) {

  const currentUserId = auth.currentUser.uid;

  const chatId = [currentUserId, otherUserId].sort().join("_");

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: ""
    });
  }

  return chatId;
}

/* SEND MESSAGE */
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
      lastMessage: text,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

/* LIST USER CHATS */
export function listenToUserChats(callback) {

  const currentUserId = auth.currentUser.uid;

  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", currentUserId),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(q, async (snapshot) => {

    const chats = [];

    for (const docSnap of snapshot.docs) {

      const data = docSnap.data();
      if (!data.lastMessage) continue;

      const otherUserId = data.participants.find(
        id => id !== currentUserId
      );

      const userDoc = await getDoc(doc(db, "users", otherUserId));

      if (userDoc.exists()) {
        chats.push({
          chatId: docSnap.id,
          lastMessage: data.lastMessage,
          ...userDoc.data()
        });
      }
    }

    callback(chats);
  });
}
