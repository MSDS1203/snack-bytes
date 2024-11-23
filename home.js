import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

//Firebase configuration
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

/*
const userEmail = localStorage.getItem("userEmail");
if (userEmail) {
  document.getElementById("user-email").textContent = userEmail;
} else {
  document.getElementById("user-email").textContent = "No user logged in.";
}
*/

const userName = localStorage.getItem("userName");
if (userName) {
  document.getElementById("username").textContent = userName + "!";
} else {
  document.getElementById("username").textContent = "No user logged in.";
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

const gamename = document.getElementById("leaderboard-name");
const scores = document.getElementById("leaderboard-scores")
const snakeLBbutton = document.getElementById("snakeLBButton");
const donutLBButton = document.getElementById("donutLBButton");
const solitaireLBButton = document.getElementById("solitaireLBButton");
const flappyBatLBButton = document.getElementById("flappyBatLBButton");

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

snakeLBbutton.addEventListener("click", async function() {
  if (snakeLBbutton.innerHTML == "Leaderboard") {
    snakeLBbutton.innerHTML = "Hide";
    renameButtons("Snake");
    const q = query(collection(db, "snakeLeaderboard"), orderBy("snake", "desc"), limit(10));
    console.log("query made");
    const querySnapshot = await getDocs(q);
    const snakeScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["snake"]); 
      snakeScores.push(newLine);
    });

    gamename.innerHTML = "Leaderboard for Snake";
    scores.innerHTML = snakeScores.join("<br>");
  } 
  else{
    snakeLBbutton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";

  }
});

donutLBButton.addEventListener("click", async function() {
  if (donutLBButton.innerHTML == "Leaderboard") {
    donutLBButton.innerHTML = "Hide";
    renameButtons("Donut");
    const q1 = query(collection(db, "donutLeaderboard"), orderBy("donutEasy", "desc"), limit(10));
    const q2 = query(collection(db, "donutLeaderboard"), orderBy("donutMedium", "desc"), limit(10));
    const q3 = query(collection(db, "donutLeaderboard"), orderBy("donutHard", "desc"), limit(10));
    console.log("query made for donut leader boards");
    const querySnapshot1 = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    const querySnapshot3 = await getDocs(q3);
    const donutScoresEasy = [];
    const donutScoresMedium = [];
    const donutScoresHard = [];
    querySnapshot1.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["donutEasy"]); 
      donutScoresEasy.push(newLine);
    });

    querySnapshot2.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["donutMedium"]); 
      donutScoresMedium.push(newLine);
    });

    querySnapshot3.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["donutHard"]); 
      donutScoresHard.push(newLine);
    });

    gamename.innerHTML = "Leaderboard for DoNOT Step There";
    scores.innerHTML = "<h3>Easy</h3>" + donutScoresEasy.join("<br>") + "<h3>Medium</h3>" + donutScoresMedium.join("<br>") + "<h3>Hard</h3>" + donutScoresHard.join("<br>");
  } 
  else {
    donutLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
  }
});

solitaireLBButton.addEventListener("click", async function() {
  if (solitaireLBButton.innerHTML == "Leaderboard") {
    solitaireLBButton.innerHTML = "Hide";
    renameButtons("Solitaire");
    const q = query(collection(db, "solitaireLeaderboard"), orderBy("solitaire", "desc"), limit(10));
    console.log("query made for solitaire leader boards");
    const querySnapshot = await getDocs(q);
    const solitaireScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["solitaire"]); 
      solitaireScores.push(newLine);
    });
    gamename.innerHTML = "Leaderboard for Solitaire";
    scores.innerHTML = solitaireScores.join("<br>");
  } 
  else {
    solitaireLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
  }
});

flappyBatLBButton.addEventListener("click", async function() {
  if (flappyBatLBButton.innerHTML == "Leaderboard") {
    flappyBatLBButton.innerHTML = "Hide";
    renameButtons("Flappy Bat");
    const q = query(collection(db, "flappyBatLeaderboard"), orderBy("flappyBat", "desc"), limit(10));
    console.log("query made for flappy bat leader boards");
    const querySnapshot = await getDocs(q);
    const flappyBatScores = [];
    querySnapshot.forEach((doc) => {
      var newLine = (doc.data()["username"]).concat(": ", doc.data()["flappyBat"]); 
      flappyBatScores.push(newLine);
    });

    gamename.innerHTML = "Leaderboard for Flappy Bat";
    scores.innerHTML = flappyBatScores.join("<br>");
  } 
  else {
    flappyBatLBButton.innerHTML = "Leaderboard";
    gamename.innerHTML = "Leaderboard";
    scores.innerHTML = " ";
  }
});