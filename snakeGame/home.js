import { doc, updateDoc } from "firebase/firestore";

// Get a reference to the document you want to update
const docRef = doc(db, "userScores", "srazam5@gmail.com");

const userEmail = localStorage.getItem("userEmail");
if (userEmail) {
  document.getElementById("user-email").textContent = userEmail;
} else {
  document.getElementById("user-email").textContent = "No user logged in.";
}


async function updateUserName(userName)
{
  // Update the document field
  await updateDoc(docRef, {
    userName: "userName"
  });
}