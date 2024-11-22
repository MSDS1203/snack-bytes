// Get each button in the dropdown menu
let standard = document.getElementById("standard-theme");
let dark = document.getElementById("dark-mode");
let pink = document.getElementById("pink-theme");
let lilac = document.getElementById("lilac-theme");

// Add event listeners for each
// .theme should equal the name of the class in themes.css
standard.addEventListener("click", updateTheme);
standard.theme = "standard";
dark.addEventListener("click", updateTheme);
dark.theme = "dark-mode";
pink.addEventListener("click", updateTheme);
pink.theme = "pink";
lilac.addEventListener("click", updateTheme);
lilac.theme = "lilac";


function updateTheme() {
    console.log("Change to theme " + this.theme);
    document.body.className = "";
    document.body.classList.add(this.theme);
    document.cookie = "theme=" + this.theme + "; path=./Minesweeper/minesweeper.html";
}


