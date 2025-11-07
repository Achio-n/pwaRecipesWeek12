// firebaseDB.js

// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  // Optional (for enhancements): query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Config
const firebaseConfig = {
  apiKey: "AIzaSyBGVgpwcfHQpmUCev9k2x5zZTQ5TOmEZAg",
  authDomain: "taskmanager-caddf.firebaseapp.com",
  projectId: "taskmanager-caddf",
  // Note: storageBucket is not used here; if you add Storage later,
  // this typically looks like "<project-id>.appspot.com"
  storageBucket: "taskmanager-caddf.firebasestorage.app",
  messagingSenderId: "320081211109",
  appId: "1:320081211109:web:b50783d9241b96e7da2e0c",
  measurementId: "G-SK1PDV0TQS",
};

// Init
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ADD
export async function addTaskToFirebase(task) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), task);
    return { id: docRef.id, ...task };
  } catch (error) {
    console.error("error adding task: ", error);
    throw error; // let the UI show a toast / handle it
  }
}

// GET (unordered; returns all)
export async function getTasksFromFirebase() {
  const tasks = [];
  try {
    const snapshot = await getDocs(collection(db, "tasks"));
    snapshot.forEach((d) => tasks.push({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("error retrieving tasks: ", error);
    // return empty array to keep UI stable
  }
  return tasks;
}

// DELETE
export async function deleteTaskFromFirebase(id) {
  try {
    await deleteDoc(doc(db, "tasks", id));
  } catch (error) {
    console.error("error deleting task: ", error);
    throw error;
  }
}

// UPDATE
export async function updateTaskInFirebase(id, updatedData) {
  try {
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, updatedData);
  } catch (error) {
    console.error("error updating task: ", error);
    throw error;
  }
}
