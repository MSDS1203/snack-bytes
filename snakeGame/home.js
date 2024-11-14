import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcTqPERyxlIKB3CCDY6BgX3tsr6S8UIzU",
    authDomain: "snack-bytes.firebaseapp.com",
    projectId: "snack-bytes",
    storageBucket: "snack-bytes.firebasestorage.app",
    messagingSenderId: "149505884441",
    appId: "1:149505884441:web:6aff0e6f5b65d453350588"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userEmail = localStorage.getItem("userEmail");
if (userEmail) {
  document.getElementById("user-email").textContent = userEmail;
} else {
  document.getElementById("user-email").textContent = "No user logged in.";
}

const userName = localStorage.getItem("userName");
if (userEmail) {
  document.getElementById("user-name").textContent = userName;
} else {
  document.getElementById("user-name").textContent = "No user logged in.";
}

const signOutButton = document.getElementById("logout");
signOutButton.addEventListener("click", function(){
  signOut(auth)
  .then(() => {
    localStorage.removeItem("userEmail");
    window.alert("Logging out.");
    window.location.href = "index.html";
  })
  .catch((error) => {
    console.log(error);
  });
})