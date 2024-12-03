import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { doc, setDoc, getFirestore, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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

// Getting buttons and containers
const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loggingIn = document.getElementById("logging-in");
const createacct = document.getElementById("create-acct")

// Getting user information after account is created
const signUpUserNameIn = document.getElementById("user-name");
const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

// Going back to the "logging-in" container
const returnBtn = document.getElementById("return-btn");

var email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword, signUpUserName;

// Create an account
createacctbtn.addEventListener("click", async function() {
  var isVerified = true;

  // Getting the email and ensuring it's correct/valid
  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if(signupEmail != confirmSignupEmail) {
      window.alert("The email fields do not match. Try again.")
      isVerified = false;
  }

  // Getting the password and ensuring it's correct/valid
  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if(signupPassword != confirmSignUpPassword) {
      window.alert("The password fields do not match. Try again.")
      isVerified = false;
  }
  
  // Getting the user name
  signUpUserName = signUpUserNameIn.value;

  // Making sure all fields are filled out
  if(signUpUserName == null || signupEmail == null || confirmSignupEmail == null || signupPassword == null || confirmSignUpPassword == null) {
    window.alert("Please fill out all fields required.");
    isVerified = false;
  }
  
  // If all fields are filled out the password, email, and username are valid, create the account
  if (isVerified) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      window.alert("Success! Account created.");
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", signUpUserName);

      // Create a new document in userScores collection based off the user just created
      await setDoc(doc(db, "userScores", user.uid), {
        username: signUpUserName,
        donutEasy: 0,
        donutMedium: 0,
        donutHard: 0,
        flappyBat: 0,
        snake: 0,
        solitaire: 0
      });

      // Initialize new documents for each leaderboard for the user
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
        donutEasy: 0,
        donutMedium: 0,
        donutHard: 0,
      });
      await setDoc(doc(db, "solitaireLeaderboard", user.uid), {
        username: signUpUserName,
        solitaire: 0,
      });

      // Go to the home page as soon as the user creates an account
      window.location.href = "home.html";

    } catch (error) {
      window.alert(error);
    }
  }

});

// Loggin in
submitButton.addEventListener("click", async function() {
  email = emailInput.value;
  password = passwordInput.value;

  try{
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;   
      const docRef = doc(db, "userScores", user.uid)
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()) {
        localStorage.setItem("userName", docSnap.data()["username"]);
      }
      else{
        window.alert("User does not exist; please create an account");
      }

      window.location.href = "home.html";
    }
    catch(error){
      window.alert(error);
    }
});

signupButton.addEventListener("click", function() {
    loggingIn.style.display = "none";
    createacct.style.display = "flex";
});

returnBtn.addEventListener("click", function() {
    loggingIn.style.display = "flex";
    createacct.style.display = "none";
});