let standard = document.getElementById("standard-theme");
let green = document.getElementById("green-theme");
let lilac = document.getElementById("lilac-theme");

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


