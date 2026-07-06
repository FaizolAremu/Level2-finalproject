// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDF2ZVD_KVoRPbB7EOBoCgHh3wAgoKOooE",
    authDomain: "cowrywise-level2project.firebaseapp.com",
    databaseURL: "https://cowrywise-level2project-default-rtdb.firebaseio.com",
    projectId: "cowrywise-level2project",
    storageBucket: "cowrywise-level2project.firebasestorage.app",
    messagingSenderId: "786945361944",
    appId: "1:786945361944:web:6682180969ffd679f59b6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };
