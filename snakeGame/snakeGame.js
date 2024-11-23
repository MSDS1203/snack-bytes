//Handling themes
let cookie = document.cookie;
let theme = parseTheme(cookie);

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

    return "";
  }

  function setTheme(theme) {
    console.log("Change to theme " + theme);
    document.body.className = "";
    document.body.classList.add(theme);
}

var body = document.getElementById("body");

//board
var blockSize = 25; 
var cols;
var rows;
var board;
var context; //Used to draw with/ our drawing object

//Width and height of snake and its semgents
var snakeWidth = 31;
var snakeHeight = 31;

//Width and height of food
var foodWidth = 20;
var foodHeight = 20;

//Width and height of obstacle
var obstWidth = 30;
var obstHeight = 30;

//Starting the snake at coordinates (50, 50)
var snakeX = 50;
var snakeY = 50;

//Giving the snake speed
var velocityX = 0;
var velocityY = 0;

//Snake body - each element in the array is a segment and each segment is an x,y coordinate for a body part
var snakeBody = [];

//drawing food 
var foodX = 200;
var foodY = 200;

//drawing obstacle
var numOfObst = 0;
var obstX = [];
var obstY = [];

//Game variables for starting, ending, and the score of the game
var gameOver = false;
var start = true;
var currentScore = 0;

var startScreen = document.getElementById("start-screen");
var screenTitle = document.getElementById("screen-title");
var screenMessage = document.getElementById("screen-message");

//When the page loads...
window.onload = function() {
    //Setting up the board
    board = document.getElementById("board"); 
    context = board.getContext("2d"); 

    //Setting up number of rows and columns
    cols = Math.floor(window.innerHeight/20);
    rows = 18;

    while(body.scrollHeight > body.clientHeight)
    {
        rows--;
    }

    board.height = rows * blockSize;
    board.width = cols * blockSize;


    //Loading up all directions of snake head images
    snakeHeadPositions = {
        up: new Image(),
        down: new Image(),
        left: new Image(),
        right: new Image()
    };

    snakeHeadPositions.up.src = "./snakeHeadUp.png";
    snakeHeadPositions.down.src = "./snakeHeadDown.png";
    snakeHeadPositions.left.src = "./snakeHeadLeft.png";
    snakeHeadPositions.right.src = "./snakeHeadRight.png";
    snakeImg = snakeHeadPositions.right;
    
    //Loading food image
    foodImg = new Image();
    foodImg.src = "./food.png";
    foodImg.onload = function() {
        context.drawImage(foodImg, foodX, foodY, foodWidth, foodHeight);
    }

    //Loadings obstacle
    obstacleImg = new Image();
    obstacleImg.src = "./obstacle.png";
    obstacleImg.onload = function() {
        context.drawImage(obstacleImg, obstX, obstY, obstWidth, obstHeight);
    }

    //Getting the current and highest score
    score = document.getElementById("score");
    score.innerHTML = currentScore;
    highScore = document.getElementById("highScore");

    updateFoodObst();

    //When you press an arrow key, look at changeDirection()
    document.addEventListener("keyup", changeDirection);

    //Calling the update function 10 times a second
    setInterval(update, 1000/10); 
}

//Will pass in a key event and then change direction depending on arrow key pressed
function changeDirection(e) {
    //Change direction to go up (but not when currently down) 
    if (e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
        snakeImg = snakeHeadPositions.up;
    }
    //Change direction to go down (but not when currently up) 
    else if (e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
        snakeImg = snakeHeadPositions.down;
    }
    //Change direction to go left (but not when currently right) 
    else if (e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
        snakeImg = snakeHeadPositions.left;
    }
    //Change direction to go right (but not when currently left) 
    else if (e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
        snakeImg = snakeHeadPositions.right;
    }
    //Restart the game if it's a game over and the space bar is pressed
    else if (e.code == "Space" && gameOver == true)
    {
        currentScore = 0;
        score.innerHTML = currentScore;
        gameOver = false;
        snakeBody = [];
        snakeX = 50;
        snakeY = 50;
        velocityX = 0;
        velocityY = 0;
        obstX = [];
        obstY = [];
        numOfObst = 0;
        updateFoodObst();
    }

    start = false;
}

//Update the board  
function update() {
    //If game over, rstop updating the canvas/drawing
    if (gameOver) 
        return;

    //Displaying the title screen
    if (start)
    {
        context.fillStyle = "black";
    }
    else{
        context.clearRect(0, 0, board.width, board.height);
        startScreen.style.display = "none";
    }

    //Draw the food image
    context.drawImage(foodImg, foodX, foodY, foodWidth, foodHeight);

    //Draw the obstacle image(s)
    for (let i = 0; i <= numOfObst; i++)
    {
        console.log("There is an obstacle here: ", obstX[i], ", ", obstY[i]);
        context.drawImage(obstacleImg, obstX[i], obstY[i], obstWidth, obstHeight);
    }
    
    //Snake eating food
    if (snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]); //grow segment where food was
        currentScore += 1;
        score.innerHTML = currentScore;
        updateFoodObst();
    }

    //Moving the body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    //Updating first body segment to take the head's place
    //If there are body parts in the array...
    if (snakeBody.length){
        //Setting the segment before the head to the coordinates of the head
        snakeBody[0] = [snakeX, snakeY];
    }

   //Moving the snake head
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.drawImage(snakeImg, snakeX, snakeY, snakeWidth, snakeHeight);

    //Drawing body segments
    for (let i = 0; i < snakeBody.length; i++){
        context.fillStyle = "#ffcdd2";
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    ////////////////////////////////////
    //going out of bounds
    if (snakeX < 0 || snakeX >= cols*blockSize || snakeY < 0 || snakeY >= rows * blockSize){
        gameOver = gameIsOver();
    } 
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] < 0 || snakeBody[i][0] >= cols * blockSize || snakeBody[i][1] < 0 || snakeBody[i][1] >= rows * blockSize){
            gameOver = gameIsOver();
        }
    }

    //the snake bumps into itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = gameIsOver();
        }
    }

    //The snake bumps into an obstacle
    for (let i = 0; i < obstX.length; i++)
    {
        if (snakeX == obstX[i] && snakeY == obstY[i]){
            gameOver = gameIsOver();
        }
    }

}

//Randomly place food and obstacle
function updateFoodObst(){

    //Randomly place food not in the same position as the snake body
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
    for(let i = 0; i < snakeBody.length; i++)
    {
        if (foodX == snakeBody[i][0] && foodY == snakeBody[i][1]){
            foodX = Math.floor(Math.random() * cols) * blockSize;
            foodY = Math.floor(Math.random() * rows) * blockSize;
        }
    }

    //Make sure the obstacle is not in the same position as the food nor the snake body
    for (let i = 0; i <= numOfObst; i++)
    {
        obstX[i] = Math.floor(Math.random() * cols) * blockSize;
        obstY[i] = Math.floor(Math.random() * rows) * blockSize;

        for(let j = 0; j < snakeBody.length; j++)
        {
            if((obstX[i] == foodX && obstY[i] == foodY) || (obstX[i] == snakeBody[j][0] && obstY[i] == snakeBody[j][1]))
            {
                obstX[i] = Math.floor(Math.random() * cols) * blockSize;
                obstY[i] = Math.floor(Math.random() * rows) * blockSize;
            } 
        }
    }
    
    //Update the number of obstacles to use when 5 more points are reached
    if (currentScore % 5 == 0 && currentScore != 0)
    {
        numOfObst++;
    }
}

//Display game over and updating high score if needed
function gameIsOver(){
    console.log("Saving current score to localStorage: ", currentScore); //FOR EVERYONE TO ADD - PUTTING THE CURRENT SCORE INTO LOCAL STORAGE
    localStorage.setItem("currentScoreSnake", currentScore);
    startScreen.style.display = "flex";
    screenTitle.innerHTML = "GAME OVER";
    screenMessage.innerHTML = "Press the space bar to begin again";



    return true;
}