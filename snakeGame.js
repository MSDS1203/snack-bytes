/*
The board will have 18X18 squares, where each 
at the top-left hand square is 0,0 and the bottom
right-hand square is 17, 17

Will be set up like so: board[x][y], where x is moving along
columns (left and right) and y is moving along the rows (up and down) 

Going down and right is positive, going left and up is negative
*/

/*
Size of the board 
----------------------------
We will use a variable called boxSize, referring to the size
of each box in the board
Ex: if the boxSize = 25, and you wanted the food box at (1,1) or [1][1],
you would have to write [1 * 25][1 * 25] in order for it to actually show. 
If we didn't multiple it with the box size, then it wouldn't show up on the 
canvas.
*/

//board
var blockSize = 25; //what we're using to fill in the coordinates
var rows = 20;
var cols = 30;
var board;
var context; //Used to draw with/ our drawing object


//Width and height of snake and its semgents
var snakeWidth = 34;
var snakeHeight = 34;

//Drawing the snake head - the snake will initially start at coordinate (5, 5)
//We have to multiply each coordinate by the blockSize for it to actually fill the coordinate space
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

//Giving the snake speed
var velocityX = 0;
var velocityY = 0;

//making the body, where each element in the array is a segment, where each segment is an x,y coordinate for a body part
var snakeBody = []

//drawing food 
var foodX;
var foodY;

//drawing obstacle
var currX = 0;
var currY = 0;
var obstX = [];
var obstY = [];

//Game variables
var gameOver = false;
var start = true;
var currentScore = 0;
var highestScore = 0;

//When the page loads...
window.onload = function() {
    board = document.getElementById("board"); //Now the element board is this canvas element tag
    board.height = rows * blockSize;
    board.width = cols * blockSize;
    context = board.getContext("2d"); //used for drawing on the board

    //loading the images
    /*
    snakeImg = new Image();
    snakeImg.src = "./snakeHead.png";
    snakeImg.onload = function() {
        context.drawImage(snakeImg, snakeX, snakeY, blockSize, blockSize)
    }
    */

    //The score
    score = document.getElementById("score");
    score.innerHTML = currentScore;
    highScore = document.getElementById("highScore");
    highScore.innerHTML = highestScore;

    //Randomly place the food and obstacle somehwere
    updateFoodObst();

    //Will wait for you to press an arrow key so as soon as you let go, snake will change direction
    document.addEventListener("keyup", changeDirection);

    //Calling the update function 10 times a second; every 100 milliseconds (1000/10) it will run the update function
    setInterval(update, 1000/10); 
}

//Will pass in a key event and then change direction depending on arrow key pressed
function changeDirection(e) {
    //Making sure that when it's going up, it's not also going down (the snake would then eat its own body)
    if (e.code == "ArrowUp" && velocityY != 1){
        velocityX = 0;
        velocityY = -1;
        snakeImg.style.transform = 'rotate(-90deg)';
    }
    //When going down, make sure it's not also going up
    else if (e.code == "ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    //When going left, make sure it's not also going right
    else if (e.code == "ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    //When going right, make sure it's not also going left
    else if (e.code == "ArrowRight" && velocityX != -1){
        velocityX = 1;
        velocityY = 0;
    }
    //Restart the game if it's a game over and the space bar is pressed
    else if (e.code == "Space" && gameOver == true)
    {
        currentScore = 0;
        score.innerHTML = currentScore;
        gameOver = false;
        snakeBody = [];
        snakeX = blockSize * 5;
        snakeY = blockSize * 5;
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

//Update the board on the HTML and redraw what we want 
//Running this function once will only do everything once 
function update() {
    //If game over, return to stop updating the canvas/drawing
    if (gameOver) 
        return;
    
    context.clearRect(0, 0, board.width, board.height); // clearing the frames

    context.fillStyle="black"; //change color of pen to black
    context.fillRect(0, 0, board.width, board.height); //starting from corner of canvas and filling a width and height of 500 (from 25 x 25)

    if (start)
    {
        context.fillStyle = "white";
        context.font = '100px Courier New';
        context.fillText("SNAKE", 220, 250);
        context.font = '30px Courier New';
        context.fillText("Press an arrow key to begin", 145, 300);
    }
    else{
        context.fillStyle="black";
        context.fillRect(0, 0, board.width, board.height);
    }

    //Painting the food under the snake head (why it's being drawn first)
    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    //Painting the obstacle
    for (let i = 0; i <= currX && i <= currY; i++)
    {
        context.fillStyle = "white";
        context.fillRect(obstX[i], obstY[i], blockSize, blockSize);
    }
    
    //Snake eating food
    if (snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]); //grow segment where food was
        currentScore += 1;
        score.innerHTML = currentScore;
        updateFoodObst();
    }

    /*moving the body - starting at the end of the body (the tail) and 
    before we update the x and y coordinate, we want the tail to get
    the previous x and y coordinates so that they can go forward*/
    //We're have the current segment move forward to where the next segment is
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    //Updating first body segment to take the head's place
    //If there are body parts in the array...
    if (snakeBody.length){
        //Setting the segment before the head to the coordinates of the head
        snakeBody[0] = [snakeX, snakeY];
    }

    //The color of the snake head
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize; //w/o blockSize, it will go really slow; will now move 1 square over rather than 1 pixel over
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize); //filRect(x-cor, y-cor, width, height)

    /*
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.drawImage(snakeImg, snakeX, snakeY, 35, 50);
    */

    //Drawing body segments
    for (let i = 0; i < snakeBody.length; i++){
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

function updateFoodObst(){
    //Randomly place food
    //Math.random returns a number from 0-1 
    //Multiplying by cols/rows to get a number from 0-19.99999 so doing floor to get rid of floor to get (0-19)
    //We then multiply it by blockSize so that it can appear
    foodX = Math.floor(Math.random() * cols) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;

    //Make sure the obstacle is not in the same position as the food
    //If it's not, then give every obstacle a new random placement
    for (let i = 0; i <= currX && i <= currY; i++)
    {
        do
        {
            obstX[i] = Math.floor(Math.random() * cols) * blockSize;
            obstY[i] = Math.floor(Math.random() * rows) * blockSize;
        } while(foodX == obstX && foodY == obstY);
    }

    if (currentScore % 5 == 0 && currentScore != 0)
    {
        currX++;
        currY++;
    }
}

function gameIsOver(){
    if (currentScore > highestScore)
    {
        highestScore = currentScore;
        highScore.innerHTML = highestScore;
    }
    context.fillStyle = "white";
    context.font = '100px Courier New';
    context.fillText("GAME OVER", 100, 250);
    context.font = '30px Courier New';
    context.fillText("Press the space bar to play again", 78, 300);

    return true;
}