    let rows = 0; // rows and cols in current board
    let cols = 0;
    let bombCount = 0 // number of bombs on the board
    let winCount = 0; // number of squares that must be clicked to win
    let menuToggle = true; // Is the menu showing?
    let flagOn = false; // Does the user have flags turned on?
    let clearCount = 0; // Counts squares clicked

    const easy = document.getElementById("easy");
    const med = document.getElementById("medium");
    const hard = document.getElementById("hard")

    const menu = document.getElementById("menu");
    const board = document.getElementById("board");
    const button = document.getElementById("flag-button");


    easy.addEventListener("click", easyBoard);
    med.addEventListener("click", medBoard);
    hard.addEventListener("click", hardBoard);


    function flagOnOff() {
        if (flagOn === true) {
            flagOn = false;
            button.style.backgroundColor = "lightgreen";
         }
        else {
            flagOn = true;
            button.style.backgroundColor = "green"; 
        }
    }

    // Menu button functions
    function easyBoard() {
        console.log("Easy clicked");
        rows = 10;
        cols = 10;
        bombCount = 10;
        winCount = 90;
        menuToggle = false;
        menu.style.display = "none";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
        //formatFlagButton();
    };

    function medBoard() {
        console.log("Medium clicked");
        rows = 16;
        cols = 16;
        bombCount = 32;
        winCount = 224;
        menuToggle = false;
        menu.style.display = "none";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
        //formatFlagButton();
    };

    function hardBoard() {
        console.log("Hard clicked");
        rows = 20;
        cols = 20;
        bombCount = 60;
        winCount = 340;
        menuToggle = false;
        menu.style.display = "none";
        let arr = buildBombs(rows, cols, bombCount);
        buildBoard(rows, cols, arr);
       // formatFlagButton();
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
                    if (bombArray[bombRow + 1][bombCol] != "B")
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
        board.style.display = "flex";

        let square = document.querySelector(".square");
        square.addEventListener("click", clickSquare);
        square.style.width = "calc(" + 80 / cols + "vh - 5px)";
        square.style.height = "calc(" + 80 / rows + "vh - 5px)";
        square.style.lineHeight = "calc(" + 80 / rows + "vh - 5px)";
        square.style.fontSize = "calc(" + 80 / rows + "vh - 20px)";

        square.bombNum = bombArr[0][0]; 
        square.clear = false;

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
    }

    /*
    function formatFlagButton() {
        button.style.display = "inline-block";
        button.style.width = "calc((" + "100vw - " + board.style.width + ") / 2 - 20px)";

    } */
    

    function clickSquare() {
        console.log(this.id + " clicked");
        console.log("r = " + this.r);
        console.log("c = " + this.c);
        console.log("flag = " + this.flag);

        if (this.clear === true)
            return;

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
        else if(this.flag === false){
            if(this.bombNum === "B") {
                gameOver(this);
            }
            else if(this.bombNum !== 0) {
                if (this.flag === true) 
                    this.removeChild(this.lastChild);

                this.style.backgroundColor = "#66FF99";                
                this.innerText = this.bombNum;
                this.clear = true;
                clearCount++;
            }
            else {       
                clearBlank(this.r, this.c);
            }

            // Win game
            if (clearCount === winCount)
            {
                alert("YOU WIN!!!");
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

    function gameOver(bomb) {

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
                
       //menuToggle = true;
       //menu.style.display = "flex";
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

        board.style.display = "none";
    }