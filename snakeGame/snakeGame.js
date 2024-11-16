//board
var blockSize = 25; 
var rows = 20;
var cols = 30;
var board;
var context; //Used to draw with/ our drawing object

//Width and height of snake and its semgents
var snakeWidth = 31;
var snakeHeight = 31;

//Width and height of food
var foodWidth = 20;
var foodHeight = 20;

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
var currX = 0;
var currY = 0;
var obstX = [];
var obstY = [];

//Game variables for starting, ending, and the score of the game
var gameOver = false;
var start = true;
var currentScore = 0;
//var highestScore = 0;

//When the page loads...
window.onload = function() {
    //Setting up the board
    board = document.getElementById("board"); 
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); 

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
        currX = 0;
        currY = 0;
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
        context.fillStyle = "white";
        context.font = '100px Courier New';
        context.fillText("SNAKE", 220, 250);
        context.font = '30px Courier New';
        context.fillText("Press an arrow key to begin", 145, 300);
    }
    else{
        context.clearRect(0, 0, board.width, board.height);
    }

    //Painting the obstacle
    for (let i = 0; i <= currX && i <= currY; i++)
    {
        context.fillStyle = "white";
        context.fillRect(obstX[i], obstY[i], blockSize, blockSize);
    }

    //Draw the food image
    context.drawImage(foodImg, foodX, foodY, foodWidth, foodHeight);
    
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
        context.fillStyle = "#4caf50";
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    //game over conditions
    ////////////////////////////////////
    //going out of bounds
    if (snakeX < 0 || snakeX > cols*blockSize || snakeY < 0 || snakeY > rows * blockSize){
        gameOver = gameIsOver();
    } 
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] < 0 || snakeBody[i][0] > cols * blockSize || snakeBody[i][1] < 0 || snakeBody[i][1] > rows * blockSize){
            gameOver = gameIsOver();
        }
    }

    //the snake bumps into itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]){
            gameOver = gameIsOver();
        }
    }

    //The snake bumps into an obstacle...
    //...when the snake only has a head
    if (snakeBody.length == 0 && snakeX == obstX[0] && snakeY == obstY[0])
    {
        gameOver = gameIsOver();
    }
    //...or when the snake has a body
    for (let i = 0; i < snakeBody.length; i++)
    {
        if (snakeX == obstX[i] && snakeY == obstY[i]){
            gameOver = gameIsOver();
        }
    }
}

//Randomly place food and obstacle
function updateFoodObst(){

    //Randomly place food
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    foodImg.onload = function() {
        context.drawImage(foodImg, foodX, foodY, foodWidth, foodHeight);
    }

    //Make sure the obstacle is not in the same position as the food
    for (let i = 0; i <= currX && i <= currY; i++)
    {
        do
        {
            obstX[i] = Math.floor(Math.random() * cols) * blockSize;
            obstY[i] = Math.floor(Math.random() * rows) * blockSize;
        } while(foodX == obstX && foodY == obstY);
    }

    //Update the number of obstacles to use when 5 more points are reached
    if (currentScore % 5 == 0 && currentScore != 0)
    {
        currX++;
        currY++;
    }
}

//Display game over and updating high score if needed
function gameIsOver(){
    console.log("Saving current score to localStorage: ", currentScore);
    localStorage.setItem("currentScoreSnake", currentScore);
    context.fillStyle = "white";
    context.font = '100px Courier New';
    context.fillText("GAME OVER", 100, 250);
    context.font = '30px Courier New';
    context.fillText("Press the space bar to play again", 78, 300);

    return true;
}