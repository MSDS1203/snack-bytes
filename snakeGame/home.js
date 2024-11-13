const userEmail = localStorage.getItem("userEmail");
if (userEmail) {
  document.getElementById("user-email").textContent = userEmail;
} else {
  document.getElementById("user-email").textContent = "No user logged in.";
}