import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDN9WpxmePFE1fzwyoAPdbJnMlRfW0MaAs",
  authDomain: "tarefas-plus-cf0a9.firebaseapp.com",
  projectId: "tarefas-plus-cf0a9",
  storageBucket: "tarefas-plus-cf0a9.firebasestorage.app",
  messagingSenderId: "484094969928",
  appId: "1:484094969928:web:8ccc2d4968c9d7d740307d"
};


const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { db };