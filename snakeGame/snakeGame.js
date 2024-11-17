//board
var blockSize = 25; 
var rows = 20;
var cols = window.innerHeight/20;
var board;
var context; //Used to draw with/ our drawing object

//Width and height of snake and its semgents
var snakeWidth = 31;
var snakeHeight = 31;

//Width and height of food
var foodWidth = 20;
var foodHeight = 20;

//Width and height of obstacle
var obstWidth = 31;
var obstHeight = 31;

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
        context.font = '100px Courier New';
        context.fillText("SNAKE", rows*blockSize, cols*blockSize/6);
        context.font = '30px Courier New';
        context.fillText("Press an arrow key to begin", rows*blockSize/1.6, cols*blockSize/5);
    }
    else{
        context.clearRect(0, 0, board.width, board.height);
    }

    //Draw the food image
    context.drawImage(foodImg, foodX, foodY, foodWidth, foodHeight);

    //Draw the obstacle image(s)
    for (let i = 0; i <= numOfObst; i++)
    {
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
        if ([foodX, foodY] == snakeBody[i]){
            foodX = Math.floor(Math.random() * cols - 5) * blockSize;
            foodY = Math.floor(Math.random() * rows - 5) * blockSize;
        }
    }

    //Make sure the obstacle is not in the same position as the food nor the snake body
    for (let i = 0; i <= numOfObst; i++)
    {
        obstX[i] = Math.floor(Math.random() * cols - 5) * blockSize;
        obstY[i] = Math.floor(Math.random() * rows - 5) * blockSize;

        for(let j = 0; j < snakeBody.length; j++)
        {
            if((obstX[i] == foodX && obstY[i]) == foodY || ([obstX[i], obstY[i]] == snakeBody[j]))
            {
                obstX[i] = Math.floor(Math.random() * cols) * blockSize;
                obstY[i] = Math.floor(Math.random() * rows) * blockSize;
            } 
        }
    }
    
    //Update the number of obstacles to use when 7 more points are reached
    if (currentScore % 7 == 0 && currentScore != 0)
    {
        numOfObst++;
    }
}

//Display game over and updating high score if needed
function gameIsOver(){
    console.log("Saving current score to localStorage: ", currentScore);
    localStorage.setItem("currentScoreSnake", currentScore);
    context.fillStyle = "black";
    context.font = '100px Courier New';
    context.fillText("GAME OVER", rows*blockSize/1.5, cols*blockSize/7);
    context.font = '30px Courier New';
    context.fillText("Press the space bar to play again", rows*blockSize/1.8, cols*blockSize/6);

    return true;
}