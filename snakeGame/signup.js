// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAi1WI0BYrfK47VPJZ_GCpaHiaown9tkRI",
    authDomain: "snackbytes-9efb1.firebaseapp.com",
    databaseURL: "https://snackbytes-9efb1-default-rtdb.firebaseio.com",
    projectId: "snackbytes-9efb1",
    storageBucket: "snackbytes-9efb1.firebasestorage.app",
    messagingSenderId: "692321315764",
    appId: "1:692321315764:web:82b4636424f2dc01dea0e1"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Create a new user with email and password
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        // Redirect the user to the home page after successful sign-up
        location.href = 'home.html';
      })
      .catch((error) => {
        // Display error message if something goes wrong
        document.getElementById('error-message').textContent = error.message;
      });
  });
  