  /***********Handle Themes**********/
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
    /******************************/
    
    let rows = 0; // rows and cols in current board
    let cols = 0;
    let bombCount = 0 // number of bombs on the board
    let winCount = 0; // number of squares that must be clicked to win
    let menuToggle = true; // Is the menu showing?
    let flagOn = false; // Does the user have flags turned on?
    let clearCount = 0; // Counts squares clicked
    let diffInt = 0; // 0 for easy, 1 for medium, 2 for hard

    const sec = document.getElementById("seconds");
    const min = document.getElementById("minutes");
    let secCnt = 0; // seconds since game started
    let minCnt = 0; // minutes since game started
    let intervalId;

    const easy = document.getElementById("easy");
    const med = document.getElementById("medium");
    const hard = document.getElementById("hard")
    const inst = document.getElementById("instructions");
    const back = document.getElementById("menu-home");
    const instText = document.getElementById("inst-text");

    const menu = document.getElementById("menu");
    const header = document.getElementById("main-h1");
    const mainPlay = document.getElementById("main-row");
    const board = document.getElementById("board");
    const button = document.getElementById("flag-button");
    const flagText = document.getElementById("flag-text");
    const winMessage = document.getElementById("win");
    const gameOverMessage = document.getElementById("game-over");

    const userClearCnt = document.getElementById("cleared-output");
    const userSquareCnt = document.getElementById("total-squares");
    const userDifficulty = document.getElementById("diff-output");
    const userBombCnt = document.getElementById("bomb-output");

    const finalBombs = document.getElementById("final-bomb-score");
    const finalTime = document.getElementById("final-time");

    const home1 = document.getElementById("home"); // Main menu home button
    const home2 = document.getElementById("home1");
    const home3 = document.getElementById("home2");
    const home4 = document.getElementById("home3");
    const home5 = document.getElementById("home4"); // Instructions menu home button
    home1.addEventListener("click", goHome);
    home2.addEventListener("click", goHome);
    home3.addEventListener("click", goHome);
    home4.addEventListener("click", goHome);
    home5.addEventListener("click", goHome);


    const replay1 = document.getElementById("replay1");
    const replay2 = document.getElementById("replay2");
    const replay3 = document.getElementById("replay3");
    replay1.addEventListener("click", reset);
    replay2.addEventListener("click", reset);
    replay3.addEventListener("click", reset);

    easy.addEventListener("click", easyBoard);
    med.addEventListener("click", medBoard);
    hard.addEventListener("click", hardBoard);
    inst.addEventListener("click", instructions);
    back.addEventListener("click", goBack)

    console.log("hello");


    // Shows instructions in the menu
    function instructions() {
        easy.style.display = "none";
        med.style.display = "none";
        hard.style.display = "none";
        inst.style.display = "none";
        home1.style.display = "none";

        back.style.display = "block";
        home5.style.display = "block";
        instText.style.display = "block";
    }

    // Hides instructions in the menu
    function goBack() {
        easy.style.display = "block";
        med.style.display = "block";
        hard.style.display = "block";
        inst.style.display = "block";
        home1.style.display = "block";
        back.style.display = "none";
        home5.style.display = "none";
        instText.style.display = "none";
    }

    // Directs user to the home page
    function goHome() {
        console.log("home");
        window.location.href = "../home.html";
    }

    // Allows space bar to toggle flag
    document.addEventListener("keydown", (event) => {
        if (event.code == "Space")
            flagOnOff();
    })

    // Toggles the flag
    function flagOnOff() {
        if (flagOn === true) {
            flagOn = false;
            button.style.backgroundColor = "lightgreen";
            flagText.innerText="Flags off";
         }
        else {
            flagOn = true;
            button.style.backgroundColor = "green"; 
            flagText.innerText="Flags on";
        }
    }

    // Menu button functions
    function easyBoard() {
        console.log("Easy clicked");
        diffInt = 0;
        rows = 10;
        cols = 10;
        bombCount = 10;
        winCount = 90;
        menuToggle = false;
        menu.style.display = "none";
        userDifficulty.innerText = "Easy";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
    };

    function medBoard() {
        console.log("Medium clicked");
        diffInt = 1;
        rows = 16;
        cols = 16;
        bombCount = 32;
        winCount = 224;
        menuToggle = false;
        menu.style.display = "none";
        userDifficulty.innerText = "Medium";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
    };

    function hardBoard() {
        console.log("Hard clicked");
        diffInt = 2;
        rows = 20;
        cols = 20;
        bombCount = 60;
        winCount = 340;
        menuToggle = false;
        menu.style.display = "none";
        userDifficulty.innerText = "Hard";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
    };   

    // Global array
    let bombArray = [];

    // Builds array for each new level
    function buildBombs(rows, cols, bombs) {

        // Initialize bombArray zeroes
        for (let i = 0; i < rows; i++)
        {
            bombArray.push([]);
            for (let j = 0; j < cols; j++)
            {
                bombArray[i].push(0);
            }
        }
        console.table(bombArray);

        let bombRow;
        let bombCol;

        // Place bombs
        for (let i = 0; i < bombs; i++)
        {
            bombRow = Math.floor(Math.random() * (rows - 1));
            bombCol = Math.floor(Math.random() * (cols - 1));
            if (bombArray[bombRow][bombCol] != "B")
            {
                bombArray[bombRow][bombCol] = "B";

                //Calculate numbers
                if (bombRow - 1 >= 0)
                {
                    if (bombCol - 1 >= 0 && bombArray[bombRow - 1][bombCol - 1] != "B")
                        bombArray[bombRow - 1][bombCol - 1]++;
                    if (bombArray[bombRow - 1][bombCol] != "B")
                        bombArray[bombRow - 1][bombCol]++;
                    if (bombCol + 1 < cols && bombArray[bombRow - 1][bombCol + 1] != "B")
                        bombArray[bombRow - 1][bombCol + 1]++;
                }
    
                    if(bombCol - 1 >= 0 && bombArray[bombRow][bombCol - 1] != "B")
                        bombArray[bombRow][bombCol - 1]++;
                    if(bombCol + 1 < cols && bombArray[bombRow][bombCol + 1] != "B")
                        bombArray[bombRow][bombCol + 1]++;
    
                if (bombRow + 1 < rows)
                {
                    if (bombCol + 1 < cols && bombArray[bombRow + 1][bombCol + 1] != "B")
                        bombArray[bombRow + 1][bombCol + 1]++;
                    if (bombArray[bombRow + 1][bombCol] != "B")
                        bombArray[bombRow + 1][bombCol]++;
                    if (bombCol - 1 >= 0 && bombArray[bombRow + 1][bombCol - 1] != "B")
                        bombArray[bombRow + 1][bombCol - 1]++;
                }
            }
            // Retry
            else
                i--;
        }

        console.table(bombArray);

        return bombArray;
    }

    // Called before each new level
    function buildBoard(rows, cols, bombArr) {
        board.style.display = "flex"; //possibly just start flex
        mainPlay.style.display = "flex";
        header.style.display = "block";
        userClearCnt.innerText = 0;
        userSquareCnt.innerText = (rows * cols) - bombCount;
        userBombCnt.innerText = bombCount;

        let square = document.querySelector(".square");
        square.style.width = "calc(" + 80 / cols + "vh - 5px)";
        square.style.height = "calc(" + 80 / rows + "vh - 5px)";
        square.style.lineHeight = "calc(" + 80 / rows + "vh - 5px)";
        square.style.fontSize = "calc(" + 80 / rows + "vh - 5px)";

        // First square
        square.addEventListener("click", clickSquare);
        square.r = 0;
        square.c = 0;
        square.flag = false;
        square.clear = false;
        square.bombNum = bombArr[0][0]; 


        // First row
        for(let j = 1; j < cols; j++) {
            let clone = square.cloneNode(true);
            clone.r = 0;
            clone.c = j;
            clone.flag = false;
            clone.clear = false;
            clone.id = "r" + 0 + "c" + j;
            clone.bombNum = bombArr[0][j];   
            square.after(clone);
            clone.addEventListener("click", clickSquare);
            square = clone;   
        }    

        // Create squares for rest of board
        for(let i = 1; i < rows; i++)
        {
            for(let j = 0; j < cols; j++) {
                let clone = square.cloneNode(true);
                clone.r = i;
                clone.c = j;
                clone.flag = false;
                clone.clear = false;
                clone.id = "r" + i + "c" + j;
                clone.bombNum = bombArr[i][j];
                square.after(clone);
                clone.addEventListener("click", clickSquare);
                square = clone;   
            }               
        }

        // Starts stopwatch and updates it every second
        intervalId = setInterval(updateTimer, 1000); 

    }

    function updateTimer() {
        secCnt = ++secCnt % 60;
        sec.innerText = String(secCnt).padStart(2, '0');
        if (secCnt == 0)
            min.innerText = ++minCnt;
    }

    function clickSquare() {
        console.log(this.id + " clicked");
        console.log("r = " + this.r);
        console.log("c = " + this.c);
        console.log("flag = " + this.flag);

        if (this.clear === true)
            return;

        // If flags are on
        if (flagOn === true) {
            if(this.flag === false) {
                // this.style.backgroundColor = "pink";

                const flagImg = document.createElement("img");
                flagImg.classList.add("flagImg");
                flagImg.src = "./LollipopFlag.png";
                flagImg.style.maxWidth = "100%";
                flagImg.style.maxHeight = "100%";
                this.appendChild(flagImg);

                this.flag = true;
            }
            else{
                this.removeChild(this.lastChild);
                this.flag = false;
            }
        }
        // If flags are off
        else if(this.flag === false){
            if(this.bombNum === "B") {
                gameOver();
            }
            else if(this.bombNum !== 0) {
                if (this.flag === true) 
                    this.removeChild(this.lastChild);

                this.style.backgroundColor = "#66FF99";                
                this.innerText = this.bombNum;
                this.clear = true;
                clearCount++;
                userClearCnt.innerText = clearCount;
            }
            else {       
                clearBlank(this.r, this.c);
                userClearCnt.innerText = clearCount;

            }

            // Win game
            if (clearCount === winCount)
            {
                win();
            }
        }
    }

    // Recursive function to clear blank spaces
    function clearBlank(curRow, curCol) {
        // Base cases
        if (curRow < 0 || curCol < 0 || curRow >= rows || curCol >= cols) //check in bounds
            return;

        let cur = document.getElementById("r" + curRow + "c" + curCol); // get current div

        if (cur.clear === true) // already cleared
            return;
        else if (cur.bombNum === "B")  // bomb
            return;
        else if (cur.bombNum !== 0) { // edge numbers
            if (cur.flag === true) 
                cur.removeChild(cur.lastChild);
            cur.style.backgroundColor = "#66FF99";     
            cur.innerText = cur.bombNum;
            cur.clear = true; 
            clearCount++;
            return;
        }

        // clear current
        if (cur.flag === true) 
            cur.removeChild(cur.lastChild);
        cur.style.backgroundColor = "#66FF99";     
        cur.clear = true;  
        clearCount++;

        // recursive cases
        clearBlank(curRow - 1, curCol);
        clearBlank(curRow - 1, curCol + 1);
        clearBlank(curRow, curCol + 1);
        clearBlank(curRow + 1, curCol + 1);
        clearBlank(curRow + 1, curCol);
        clearBlank(curRow + 1, curCol - 1);
        clearBlank(curRow, curCol - 1);
        clearBlank(curRow - 1, curCol - 1);
    }

    function gameOver() {
        // stop timer 
        clearInterval(intervalId);

        // reveal bombs
        for (let i = 0; i < rows; i++)
        {
            for (let j = 0; j < cols; j++)
            {
                if (bombArray[i][j] === "B")
                {
                    let bombImg = document.createElement("img");
                    bombImg.classList.add("bombImg");
                    bombImg.src = "./JellyDoughnut.png";
                    bombImg.style.maxWidth = "100%";
                    bombImg.style.maxHeight = "100%";

                    let cur = document.getElementById("r" + i + "c" + j); // get current bomb div
                    cur.appendChild(bombImg);
                    cur.style.backgroundColor = "red";  
                    cur.clear = true;
                }
            }
            
        }

        gameOverMessage.style.display = "flex";
        finalBombs.innerHTML = bombCount;

    }

    function win() {
        localStorage.setItem("currentScoreMineSweep", minCnt * 60 + secCnt); /* Store score */
        localStorage.setItem("MineSweepDifficulty", diffInt); /* Store difficulty */
        clearInterval(intervalId);
        winMessage.style.display = "flex";
        finalTime.innerHTML = minCnt + ":" + String(secCnt).padStart(2, '0');
    }

    function reset() {
        // Get rid of all squares
        while (board.firstChild) {
            board.removeChild(board.lastChild);
        }

        // Add square div back
        const newDiv = document.createElement("div");
        newDiv.id = "r0c0";
        newDiv.classList.add("square");
        board.appendChild(newDiv);

        // Reset global variables
        rows = 0; 
        cols = 0;
        bombCount = 0;
        winCount = 0; 
        clearCount = 0; 
        menuToggle = true; 
        flagOn = false; 
        bombArray.length = 0;

        secCnt = 0;
        minCnt = 0;
        min.innerHTML = "0";
        sec.innerHTML = "00";

        gameOverMessage.style.display = "none";
        winMessage.style.display = "none";
        board.style.display = "none";
        mainPlay.style.display = "none";
        header.style.display = "none";
        menuToggle = true;
        menu.style.display = "flex";
    }