import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const db = getFirestore(app);

const userEmail = localStorage.getItem("userEmail");
if (userEmail) {
  document.getElementById("user-email").textContent = userEmail;
} else {
  document.getElementById("user-email").textContent = "No user logged in.";
}

const userName = localStorage.getItem("userName");
if (userName) {
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
    window.location.href = "login.html";
  })
  .catch((error) => {
    console.log(error);
  });
})

const scoresForSnake = document.getElementById("scoresForSnake");
const snakeBox = document.getElementById("snakeBox");
const snakeLBbutton = document.getElementById("snakeLBButton");
snakeLBbutton.addEventListener("click", async function() {
  if (snakeBox.style.display === "none" || snakeBox.style.display === "") {
    snakeBox.style.display = "block";
    snakeLBbutton.innerHTML = "Hide Leaderboard";
    const q = query(collection(db, "snakeLeaderboard"), orderBy("snake", "desc"), limit(10));
    console.log("query made");
    const querySnapshot = await getDocs(q);
    const snakeScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["snake"]); 
      snakeScores.push(newLine);
    });

    scoresForSnake.innerHTML = snakeScores.join("<br>");
  } else {
    snakeBox.style.display = "none";
    snakeLBbutton.innerHTML = "Show Leaderboard";
  }
});

const scoresForDonut = document.getElementById("scoresForDonut");
const donutBox = document.getElementById("donutBox");
const donutLBButton = document.getElementById("donutLBButton");
donutLBButton.addEventListener("click", async function() {
  if (donutBox.style.display === "none" || donutBox.style.display === "") {
    donutBox.style.display = "block";
    donutLBButton.innerHTML = "Hide Leaderboard";
    const q = query(collection(db, "donutLeaderboard"), orderBy("donut", "desc"), limit(10));
    console.log("query made for donut leader boards");
    const querySnapshot = await getDocs(q);
    const donutScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["donut"]); 
      donutScores.push(newLine);
    });
    console.log(donutScores);

    scoresForDonut.innerHTML = donutScores.join("<br>");
  } else {
    donutBox.style.display = "none";
    donutLBButton.innerHTML = "Show Leaderboard";
  }
});

const scoresForSolitaire = document.getElementById("scoresForSolitaire");
const solitaireBox = document.getElementById("solitaireBox");
const solitaireLBButton = document.getElementById("solitaireLBButton");
solitaireLBButton.addEventListener("click", async function() {
  if (solitaireBox.style.display === "none" || solitaireBox.style.display === "") {
    solitaireBox.style.display = "block";
    solitaireLBButton.innerHTML = "Hide Leaderboard";
    const q = query(collection(db, "solitaireLeaderboard"), orderBy("solitaire", "desc"), limit(10));
    console.log("query made for solitaire leader boards");
    const querySnapshot = await getDocs(q);
    const solitaireScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["solitaire"]); 
      solitaireScores.push(newLine);
    });
    console.log(solitaireScores);

    scoresForSolitaire.innerHTML = solitaireScores.join("<br>");
  } else {
    solitaireBox.style.display = "none";
    solitaireLBButton.innerHTML = "Show Leaderboard";
  }
});

const scoresForFlappyBat = document.getElementById("scoresForFlappyBat");
const flappyBatBox = document.getElementById("flappyBatBox");
const flappyBatLBButton = document.getElementById("flappyBatLBButton");
flappyBatLBButton.addEventListener("click", async function() {
  if (flappyBatBox.style.display === "none" || flappyBatBox.style.display === "") {
    flappyBatBox.style.display = "block";
    flappyBatLBButton.innerHTML = "Hide Leaderboard";
    const q = query(collection(db, "flappyBatLeaderboard"), orderBy("flappyBat", "desc"), limit(10));
    console.log("query made for flappy bat leader boards");
    const querySnapshot = await getDocs(q);
    const flappyBatScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["flappyBat"]); 
      flappyBatScores.push(newLine);
    });
    console.log(flappyBatScores);

    scoresForFlappyBat.innerHTML = flappyBatScores.join("<br>");
  } else {
    flappyBatBox.style.display = "none";
    flappyBatLBButton.innerHTML = "Show Leaderboard";
  }
});