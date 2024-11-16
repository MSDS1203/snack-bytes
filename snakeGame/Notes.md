## About the JavaScript board
If we we had a board that was 18X18 squares, the  top-left hand square is 0,0 and the bottom right-hand square is 17, 17
Will be set up like so: board[x][y], where x is moving along columns (left and right) and y is moving along the rows (up and down) 
Going down and right is positive, going left and up is negative

Size of the board 
----------------------------
We will use a variable called blockSize, referring to the size
of each box in the board
Ex: if the boxSize = 25, and you wanted the food box at (1,1) or [1][1],
you would have to write [1 * 25][1 * 25] in order for it to actually show. 
If we didn't multiple it with the box size, then it wouldn't show up on the 
canvas.

## Moving the body parts of the snake
Moving the body - starting at the end of the body (the tail) and 
    before we update the x and y coordinate, we want the tail to get
    the previous x and y coordinates so that they can go forward
    We're have the current segment move forward to where the next segment is

## Randomly placing food
Math.random returns a number from 0-1 
Multiplying by cols/rows to get a number from 0-19.99999 so doing floor to get rid of floor to get (0-19)
We then multiply it by blockSize so that it can appear