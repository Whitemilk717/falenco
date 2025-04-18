import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDdNm8a4njArh57lYEYKZWyyzkib6wmRmk",
    authDomain: "falenco-c1c42.firebaseapp.com",
    projectId: "falenco-c1c42",
    storageBucket: "falenco-c1c42.firebasestorage.app",
    messagingSenderId: "370282962650",
    appId: "1:370282962650:web:f3abe526dc1519c8e34fe3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };