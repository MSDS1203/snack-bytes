import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";


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
const db = getFirestore(app);
const submitScore = document.getElementById("submitScore");
const auth = getAuth();

console.log("firebase app initialized: ", app.name);
console.log("firestore initialized: ", !!db);

var currHighScore;
var newHighScore;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("UID: ", uid);
    const scoreRef = collection(db, "userScores");
    const q = query(collection(db, "cities"), where("capital", "==", true));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        
    });

    try{
        currHighScore = docSnap.data()["snake"];

    }catch(error){
        console.log("No such document!");
    }



    submitScore.addEventListener("click", async function() {
        //Getting the current high score to see if it's smaller than the new high score
        console.log("User requested to submit score");
        console.log("Current UID: ", uid);
        console.log(`Document path: userScores/${uid}`);
    
        newHighScore = Number(localStorage.getItem("currentScoreSnake"));
        console.log("New score to be added: ", newHighScore);
    
        try{
            const docRef = doc(db, "userScores", uid);
            console.log("getting the doc reference: ", !!docRef);
            const docSnap = await getDoc(docRef);
            console.log("i am now here");

            const docRef1 = doc(db, "snakeLeaderboard", uid);
            console.log("getting the doc reference for snake leaderboard: ", !!docRef);
            console.log("i am now here");
    
            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data()["snake"]);
                currHighScore = docSnap.data()["snake"];
    
                if(newHighScore > currHighScore)
                {
                    console.log("High score is being updated");
                    await setDoc(docRef, { snake: newHighScore }, { merge: true });
                    await setDoc(docRef1, { snake: newHighScore }, { merge: true });
                    window.alert("New high score!");
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

  } else {
    console.log("User is not signed in");
    window.alert("You're not signed in");
  }
});