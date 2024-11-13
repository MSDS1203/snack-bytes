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
  
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('user-info').textContent = `Logged in as: ${user.email}`;
    } else {
      location.href = 'login.html'; // Redirect to login page if not logged in
    }
  });
  
  function logout() {
    auth.signOut().then(() => {
      location.href = 'login.html'; // Redirect to login page after logout
    });
  }
  