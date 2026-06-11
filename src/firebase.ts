import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHJw9F29Sayf480OPEqLiwZtU4_22xmzE",
  authDomain: "wedding-guestbook-48fea.firebaseapp.com",
  projectId: "wedding-guestbook-48fea",
  storageBucket: "wedding-guestbook-48fea.firebasestorage.app",
  messagingSenderId: "599939973795",
  appId: "1:599939973795:web:0843160c9c6cefe7147516"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);