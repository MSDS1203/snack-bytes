// Snack Bytes Copyright (C) 2024  Sofia Azam, Kailee Grubbs, Stephanie Sarambo, Marian Sousan
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Firebase configurations
const firebaseConfig = {
    apiKey: "AIzaSyDcTqPERyxlIKB3CCDY6BgX3tsr6S8UIzU",
    authDomain: "snack-bytes.firebaseapp.com",
    projectId: "snack-bytes",
    storageBucket: "snack-bytes.firebasestorage.app",
    messagingSenderId: "149505884441",
    appId: "1:149505884441:web:6aff0e6f5b65d453350588"
};

// Initializing Firebase application
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Displaying the user name of the user currently logged in
const userName = localStorage.getItem("userName");
if (userName) {
  document.getElementById("username").textContent = userName + "!";
} else {
  document.getElementById("username").textContent = "No user logged in.";
}

// Signing out 
const signOutButton = document.getElementById("logout");
signOutButton.addEventListener("click", function(){
  signOut(auth)
  .then(() => {
    window.location.href = "login.html";
  })
  .catch((error) => {
    console.log(error);
  });
})

// Leaderboard buttons and names
const leaderboard = document.getElementById("leaderboard");
const gamename = document.getElementById("leaderboard-name");
const scores = document.getElementById("leaderboard-scores")
const snakeLBbutton = document.getElementById("snakeLBButton");
const donutLBButton = document.getElementById("donutLBButton");
const solitaireLBButton = document.getElementById("solitaireLBButton");
const flappyBatLBButton = document.getElementById("flappyBatLBButton");

// Renaming the buttons when their leaderboard is being displayed
function renameButtons(buttonName)
{
  if(buttonName != "Snake")
  {
    snakeLBbutton.innerHTML = "Leaderboard";
  }
  
  if(buttonName != "Flappy Bat")
  {
    flappyBatLBButton.innerHTML = "Leaderboard";
  }
  
  if(buttonName != "Donut")
  {
    donutLBButton.innerHTML = "Leaderboard";
  }
  
  if(buttonName != "Solitaire")
  {
    solitaireLBButton.innerHTML = "Leaderboard";
  }
}

// Snake leaderboard
snakeLBbutton.addEventListener("click", async function() {
  if (snakeLBbutton.innerHTML == "Leaderboard") {
    snakeLBbutton.innerHTML = "Hide";
    renameButtons("Snake");
    const q = query(collection(db, "snakeLeaderboard"), orderBy("snake", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const snakeScores = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["snake"] > 0)
      {
        var newLine = (doc.data()["username"]).concat(": ", doc.data()["snake"]); 
        snakeScores.push(newLine);
      }
    });
    
    leaderboard.style.display = "block";
    gamename.innerHTML = "Leaderboard for Snake";
    scores.innerHTML = snakeScores.join("<br>");
  } 
  else{
    snakeLBbutton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
    leaderboard.style.display = "none";
  }
});

// Donut leaderboard
donutLBButton.addEventListener("click", async function() {
  if (donutLBButton.innerHTML == "Leaderboard") {
    donutLBButton.innerHTML = "Hide";
    renameButtons("Donut");
    const q1 = query(collection(db, "donutLeaderboard"), orderBy("donutEasy"), limit(10));
    const q2 = query(collection(db, "donutLeaderboard"), orderBy("donutMedium"), limit(10));
    const q3 = query(collection(db, "donutLeaderboard"), orderBy("donutHard"), limit(10));
    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    const querySnapshot3 = await getDocs(q3);
    const donutScoresEasy = [];
    const donutScoresMedium = [];
    const donutScoresHard = [];
    
    querySnapshot1.forEach((doc) => {
      if (doc.data()["donutEasy"] > 0)
      {
        var totalSeconds = doc.data()["donutEasy"];
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        if (seconds < 10){
          seconds = "0" + seconds;
        }

        var newLine = (doc.data()["username"]).concat(" - ", minutes, ":", seconds); 
        donutScoresEasy.push("<span>" + newLine + "</span>");
      }
    });

    querySnapshot2.forEach((doc) => {
      if (doc.data()["donutMedium"] > 0)
      {
        var totalSeconds = doc.data()["donutMedium"];
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        if (seconds < 10){
          seconds = "0" + seconds;
        }

        var newLine = (doc.data()["username"]).concat(" - ", minutes, ":", seconds); 
        donutScoresMedium.push(newLine);
      }
    });

    querySnapshot3.forEach((doc) => {
      if (doc.data()["donutHard"] > 0){
        var totalSeconds = doc.data()["donutHard"];
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        if (seconds < 10){
          seconds = "0" + seconds;
        }

        var newLine = (doc.data()["username"]).concat(" - ", minutes, ":", seconds); 
        donutScoresHard.push(newLine);
      }
    });

    leaderboard.style.display = "block";
    gamename.innerHTML = "Leaderboard for DoNOT Step There";
    scores.innerHTML = "<h3>Easy</h3>" + donutScoresEasy.join("<br>") + "<h3>Medium</h3>" + donutScoresMedium.join("<br>") + "<h3>Hard</h3>" + donutScoresHard.join("<br>");
  } 
  else {
    donutLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
    leaderboard.style.display = "none";
  }
});

// Solitaire leaderboard
solitaireLBButton.addEventListener("click", async function() {
  if (solitaireLBButton.innerHTML == "Leaderboard") {
    solitaireLBButton.innerHTML = "Hide";
    renameButtons("Solitaire");
    const q = query(collection(db, "solitaireLeaderboard"), orderBy("solitaire"), limit(10));
    const querySnapshot = await getDocs(q);
    const solitaireScores = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["solitaire"] > 0) {
        var totalSeconds = doc.data()["solitaire"];
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        if (seconds < 10){
          seconds = "0" + seconds;
        }

        var newLine = (doc.data()["username"]).concat(" - ", minutes, ":", seconds); 
        solitaireScores.push(newLine);
      }
    });

    leaderboard.style.display = "block";
    gamename.innerHTML = "Leaderboard for Solitaire";
    scores.innerHTML = solitaireScores.join("<br>");
  } 
  else {
    solitaireLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
    leaderboard.style.display = "none";
  }
});

// Flappy Bat leaderboard
flappyBatLBButton.addEventListener("click", async function() {
  if (flappyBatLBButton.innerHTML == "Leaderboard") {
    flappyBatLBButton.innerHTML = "Hide";
    renameButtons("Flappy Bat");
    const q = query(collection(db, "flappyBatLeaderboard"), orderBy("flappyBat", "desc"), limit(10));
    const querySnapshot = await getDocs(q);
    const flappyBatScores = [];
    querySnapshot.forEach((doc) => {
      if (doc.data()["flappyBat"] > 0){
        var newLine = (doc.data()["username"]).concat(": ", doc.data()["flappyBat"]); 
        flappyBatScores.push(newLine);
      }
    });

    leaderboard.style.display = "block";
    gamename.innerHTML = "Leaderboard for Flappy Bat";
    scores.innerHTML = flappyBatScores.join("<br>");
  } 
  else {
    flappyBatLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
    leaderboard.style.display = "none";
  }
});