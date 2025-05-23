// Snack Bytes Copyright (C) 2024  Sofia Azam, Kailee Grubbs, Stephanie Sarambo, Marian Sousan
// This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
// This is free software, and you are welcome to redistribute it
// under certain conditions; type `show c' for details.

/***** Parse existing cookies *****/

let cookie = document.cookie;
console.log(cookie);

let theme = parseTheme(cookie);
console.log(theme);

setTheme(theme); 

function parseTheme(cookie) {
    let cookieArray = cookie.split(';'); //Split into an array of cookies

    for (i = 0; i < cookieArray.length; i++)
    {
        let keyValue = cookieArray[i].split('='); //Split each cookie into key-value pairs
        if (keyValue[0] === "theme") {
            return keyValue[1];
        }
    }

    return "standard";
    }

function setTheme(theme) {
    console.log("Change to theme " + theme);
    document.body.className = "";
    document.body.classList.add(theme);
}


/***** Set new cookies *****/

// Get each button in the dropdown menu
let standard = document.getElementById("standard-theme");
let dark = document.getElementById("dark-mode");
let pink = document.getElementById("pink-theme");
let lilac = document.getElementById("lilac-theme");
let candy = document.getElementById("candy-theme");
let snakeCupcake = document.getElementById("snakeCupcake-theme");

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
candy.addEventListener("click", updateTheme);
candy.theme = "candy";
snakeCupcake.addEventListener("click", updateTheme);
snakeCupcake.theme = "snakeCupcake";


function updateTheme() {
    console.log("Change to theme " + this.theme);
    document.body.className = "";
    document.body.classList.add(this.theme);
    document.cookie = "theme=" + this.theme;
}




