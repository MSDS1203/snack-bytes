//https://firebase.google.com/docs/firestore/manage-data/add-data

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("firebase app initialized: ", app.name);
console.log("firestore initialized: ", !!db);


const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct")

const signUpUserNameIn = document.getElementById("user-name");
const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword, signUpUserName;

createacctbtn.addEventListener("click", async function() {
  var isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("Email fields do not match. Try again.")
      isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("Password fields do not match. Try again.")
      isVerified = false;
  }
  
  signUpUserName = signUpUserNameIn.value;
  if(signUpUserName == null || signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }
  
  if (isVerified) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      window.alert("Success! Account created.");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", signUpUserName);

      console.log("User ID:", user.uid);
      console.log(auth.currentUser);

      console.log("Attemptying to add user data to firestore:");
      // Add user data to Firestore with user ID
      await setDoc(doc(db, "userScores", user.uid), {
        username: signUpUserName,
        donut: 0,
        flappyBat: 0,
        snake: 0,
        solitaire: 0
      });
      console.log("User data added to firestore");

      await setDoc(doc(db, "snakeLeaderboard", user.uid), {
        username: signUpUserName,
        snake: 0,
      });

      await setDoc(doc(db, "flappyBatLeaderboard", user.uid), {
        username: signUpUserName,
        flappyBat: 0,
      });

      await setDoc(doc(db, "donutLeaderboard", user.uid), {
        username: signUpUserName,
        donut: 0,
      });

      await setDoc(doc(db, "solitaireLeaderboard", user.uid), {
        username: signUpUserName,
        solitaire: 0,
      });

      window.location.href = "home.html";

    } catch (error) {
      console.error("Error occurred:", error);
      window.alert("Error occurred. Try again.");
    }
  }

});

submitButton.addEventListener("click", async function() {
  email = emailInput.value;
  console.log(email);
  password = passwordInput.value;
  console.log(password);

  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Success! Welcome back!");
      window.alert("Success! Welcome back!");
      localStorage.setItem("userEmail", user.email);      

      const docRef = doc(db, "userScores", user.uid)
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()) {
        console.log("Document data: ", docSnap.data());
        localStorage.setItem("userName", docSnap.data()["username"]);
      }
      else{
        console.log("document doesn't exist ");
      }

      window.location.href = "home.html";
    }
    catch(error){
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error occurred. Try again.");
      window.alert("Error occurred. Try again.");
    }
});

signupButton.addEventListener("click", function() {
    main.style.display = "none";
    createacct.style.display = "flex";
});

returnBtn.addEventListener("click", function() {
    main.style.display = "flex";
    createacct.style.display = "none";
});