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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth();

//Getting the HTML elements that contain the button and showing the high score respectively
const submitScore = document.getElementById("submit-score");
const highScore = document.getElementById("high-score");

//Checking if the firebase application and the firestore database has been gotten
console.log("firebase app initialized: ", app.name);
console.log("firestore initialized: ", !!db);

var currHighScore;
var newHighScore;
var difficulty;

//Checking the current state of the current user
onAuthStateChanged(auth, async (user) => {
    //Checking if the current user logged in is authenticated; is the only way to make read/writes to the DB
    if (user) {
        //Getting the current user's UID - what each document is
        const uid = user.uid;
        
        //Getting all the document from the database(db), collection(userScores), and document (uid) respectively 
        const docRef = doc(db, "userScores", uid);
        console.log("getting the collection reference to display current high score: ", !!docRef);

        //Same thing but for the game's leaderboard 
        //FOR EVERYONE TO CHANGE - "snakeLeaderboard" to whatever your game's leaderboard is
        const docRef1 = doc(db, "donutLeaderboard", uid);
        console.log("getting the doc reference for donut leaderboard: ", !!docRef1);

        //Getting the document
        const docSnap = await getDoc(docRef);
        console.log("I have the doc");
    
        //If the document exists, when the user first logs in, show their current high score
        if (docSnap.exists()) {
            console.log("Current score for", uid, ":", docSnap.data()["donutEasy"]);
            difficulty = Number(localStorage.getItem("MineSweepDifficulty"));

            if (difficulty === 0) {
                currHighScore = docSnap.data()["donutEasy"];
            }
            else if (difficulty === 1) {
                currHighScore = docSnap.data()["donutMedium"];
            }
            else {
                currHighScore = docSnap.data()["donutHard"];
            }
            
            highScore.innerHTML = Math.floor(currHighScore / 60) + ":" + String(currHighScore % 60).padStart(2, '0');
        }
    
    
        //When the user presses the submit score button...
        submitScore.addEventListener("click", async function() {
            console.log("User requested to submit score");
            
            //Getting the current score the user has from local storage
            //FOR EVERYONE - CHANGE "currentScoreSnake" TO WHAT YOU HAVE YOUR CURRENT SCORE SAVED IN STORAGE AS
            newHighScore = Number(localStorage.getItem("currentScoreMineSweep"));
            difficulty = Number(localStorage.getItem("MineSweepDifficulty"));
            console.log("New score to be added: ", newHighScore);
        
            try{
                if (docSnap.exists()) {
                    console.log("Document data:", docSnap.data()["donutEasy"]);
                    //Getting the current high score in the database
                    //FOR EVERYONE - change "snake" to your game as written in the userScores collection
                    if (difficulty === 0) {
                        currHighScore = docSnap.data()["donutEasy"];
                    }
                    else if (difficulty === 1) {
                        currHighScore = docSnap.data()["donutMedium"];
                    }
                    else {
                        currHighScore = docSnap.data()["donutHard"];
                    }        
                    //Updatting and displaying the new high score if the one currently in the database is lower
                    if(newHighScore < currHighScore || currHighScore === 0)
                    {
                        console.log("High score is being updated");

                        //Using "merge" to add the new data to the respective documents; not doing so would overwrite everything
                        //FOR EVERYONE TO CHANGE - change snake to your game name as written in the document
                        if (difficulty === 0) {
                            await setDoc(docRef, { donutEasy: newHighScore }, { merge: true }); 
                            await setDoc(docRef1, { donutEasy: newHighScore }, { merge: true });                        }
                        else if (difficulty === 1) {
                            await setDoc(docRef, { donutMedium: newHighScore }, { merge: true }); 
                            await setDoc(docRef1, { donutMedium: newHighScore }, { merge: true });                        }
                        else {
                            await setDoc(docRef, { donutHard: newHighScore }, { merge: true }); 
                            await setDoc(docRef1, { donutHard: newHighScore }, { merge: true });                        } 
                        
                        highScore.innerHTML = Math.floor(newHighScore / 60) + ":" + String(newHighScore % 60).padStart(2, '0');
                    }
                    else{
                        window.alert("Score isn't high enough");
                    }
        
                } else {
                    console.log("No such document!");
                }
            }catch(error)
            {
                console.error("Error updating high score:", error);
            }
        });
    
    }  
    else {
        console.log("User is not signed in");
        window.alert("You're not signed in");
    }
    });