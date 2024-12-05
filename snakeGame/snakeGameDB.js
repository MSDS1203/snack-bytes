// Snack Bytes Copyright (C) 2024  Sofia Azam, Kailee Grubbs, Stephanie Sarambo, Marian Sousan
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcTqPERyxlIKB3CCDY6BgX3tsr6S8UIzU",
    authDomain: "snack-bytes.firebaseapp.com",
    projectId: "snack-bytes",
    storageBucket: "snack-bytes.firebasestorage.app",
    messagingSenderId: "149505884441",
    appId: "1:149505884441:web:6aff0e6f5b65d453350588"
};

// Initialize Firebase applications
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Getting the HTML elements for button and showing the high score
const submitScore = document.getElementById("submitScore");
const highScore = document.getElementById("highScore");

var currHighScore;
var newHighScore;

//Checking the current state of the current user
onAuthStateChanged(auth, async (user) => {
    //Checking if the current user logged in is authenticated; is the only way to make read/writes to the DB
    if (user) {
        const uid = user.uid;
        
        //Getting all the documents from the userScores and snakeLeaderboard collection 
        const docRef = doc(db, "userScores", uid);
        const docRef1 = doc(db, "snakeLeaderboard", uid);
        const docSnap = await getDoc(docRef);
    
        //When the user first logs in, show their current high score
        if (docSnap.exists()) {
            currHighScore = docSnap.data()["snake"];
            highScore.innerHTML = currHighScore;
        }
    
        //When the user presses the submit score button...
        submitScore.addEventListener("click", async function() {
            
            //Getting the current score the user has from local storage
            newHighScore = Number(localStorage.getItem("currentScoreSnake"));
        
            try{
                if (docSnap.exists()) {
                    //Getting the current high score in the database
                    currHighScore = docSnap.data()["snake"]; 
        
                    //Updatting and displaying the new high score if the one currently in the database is lower
                    if(newHighScore > currHighScore)
                    {
                        //Add the new data to the respective documents
                        await setDoc(docRef, { snake: newHighScore }, { merge: true }); 
                        await setDoc(docRef1, { snake: newHighScore }, { merge: true });
                        highScore.innerHTML = newHighScore;
                    }
                    else{
                        window.alert("Score isn't high enough");
                    }
        
                } 
                else {
                    console.log("No such document!");
                }
            }catch(error)
            {
                console.error("Error updating high score:", error);
            }
        });
    
    }  
    else {
        window.alert("You're not signed in");
    }
    });