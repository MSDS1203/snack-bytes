// get each button in the dropdown menu
let standard = document.getElementById("standard-theme");
let green = document.getElementById("green-theme");
let lilac = document.getElementById("lilac-theme");

// Add event listeners for each
// .theme should equal the name of the class in themes.css
standard.addEventListener("click", updateTheme);
standard.theme = "standard";
green.addEventListener("click", updateTheme);
green.theme = "green";
lilac.addEventListener("click", updateTheme);
lilac.theme = "lilac";


function updateTheme() {
    console.log("Change to theme " + this.theme);
    document.body.className = "";
    document.body.classList.add(this.theme);
}


