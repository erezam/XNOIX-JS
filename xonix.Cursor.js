xonix = window.xonix || {};
xonix.Cursor = function(options) {
    const RIGHT = 1, LEFT = 2;
    let {board ,x, y, width, height, checkLose,ball1} = options;
    const rWidth = 20, rHeight = 20, DX = 0.08;
    const rows = height/rWidth;
    const cols = width/rHeight;
	let xDir = 1 , yDir=1;
	let isMovingX = false, isMovingY = false, atLWall = false, atRWall = false ,atUWall=false , atDWall=false;
    //let drawFrom = {xMove:x , yMove:y};
    let inZone = true;
    let arrMoves = [];
    let recursiveFlag=0;
    

    let update = function(delta) {
        if(!isMovingX && !isMovingY) 
            return;
		
		// move x
        if(isMovingX && (!atLWall || !atRWall))
            x+=20*xDir;//x += DX * xDir * delta;
        
		// move y
        if(isMovingY && (!atUWall || !atDWall))    
            y+=20*yDir;//y += DX * yDir *delta;
        
        nextMove = {nextX:x/20 , nextY:y/20};
        if(checkColor(x/20,y/20)==1 && arrMoves.length!=0)	// close shape , fill!
        {
            fillShape();
            recursiveFlag=0;
            arrMoves=[];
        }
        else if(checkColor(x/20,y/20)==2)	// hit the path = lose
        {
            checkLose = true;
            return;
        }
        else
        {
            if(board[realPlace(y/20,x/20)]==0){		// empty space
                if(arrMoves.length==0)				// first move , add starting position
                {
                    let firstMove;
                    if(isMovingX && xDir==1)
                        firstMove = {nextX:(x-20)/20 , nextY:y/20};
                    else if(isMovingX && xDir==-1)
                        firstMove = {nextX:(x+20)/20 , nextY:y/20}; 
                    else if(isMovingY && yDir==1)
                        firstMove = {nextX:x/20 , nextY:(y-20)/20}; 
                    else if(isMovingY && yDir==-1)
                        firstMove = {nextX:x/20 , nextY:(y+20)/20}; 
                    arrMoves.push(firstMove);  
                }
                board[realPlace(y/20,x/20)]=2;		// 2 for path(blue)
                arrMoves.push(nextMove);
            }
        }
       
		// check walls
        if(x <= 0) {
            isMovingX = false;
            atLWall = true;
        }
        else if(x + rWidth >= width) {
            isMovingX = false;
            atRWall = true;
        }

        if(y <= 0) {
            isMovingY = false;
            atUWall = true;
        }
        else if(y + rHeight >= height) {
            isMovingY = false;
            atDWall = true;
        }

	};
	
	let draw = function(context) {
		context.fillStyle = "white";
        context.fillRect(x, y, rWidth, rHeight); 
	};
  
    // Arrow keys functions
	
    let moveLeft = function() {
        if(atLWall)
            return;
        xDir = -1;
        isMovingX = true;
        isMovingY = false;
        atRWall = false;
    };
    
    let moveRight = function() {
        if(atRWall)
            return;
        xDir = 1;
        isMovingX = true;
        isMovingY = false;
        atLWall = false;
    };

    let moveUp = function() {
        if(atUWall)
            return;
        yDir = -1;
        isMovingY = true;
        isMovingX = false;
        atDWall = false;
    };

    let moveDown = function() {
        if(atDWall)
            return;
        yDir = 1;
        isMovingY = true;
        isMovingX = false;
        atUWall = false;
    };
    
    // 2d arr index to 1d array index
    let realPlace = function(i,j){
        return i*cols+j;
    };

	// return number from board by index
    let checkColor = function(x,y){
        return board[realPlace(y,x)];
    };

	// fill close shape
    let fillShape = function(){
        let firstX = arrMoves[0].nextX , firstY=arrMoves[0].nextY;
        let lastX = arrMoves[arrMoves.length-1].nextX , lastY=arrMoves[arrMoves.length-1].nextY;
        board[realPlace(lastY,lastX)]=1;	// ending postion to red
        traverse(lastX,lastY,firstX,firstY);	// mark with 9 the path from end to start 
        let fillOption1 = [];
        let fillOption2 = [];

        for(let i=1 ; i<rows ; i++){     // fill from left wall
            let flag2 = false;
            for(let j=0; j<cols ; j++){
                if(board[realPlace(i,j)]==2 || board[realPlace(i,j)]==9)	// fill from frame to frame or 9
                {
                    if(j!=49)
                        if(board[realPlace(i,j+1)]==2 || board[realPlace(i,j+1)]==9)
                            break;
                    flag2=!flag2;
                }
                if(flag2)
                {
                    let fill = {fillX:j , fillY:i};
                    fillOption1.push(fill); 
                }
            }
        }

        for(let i=0 ; i<rows ; i++){     // fill from right wall
            let flag2 = false;
            for(let j=cols-1; j>=0 ; j--){
                if(board[realPlace(i,j)]==2 || board[realPlace(i,j)]==9)
                {
                    if(j!=0)
                        if(board[realPlace(i,j-1)]==2 || board[realPlace(i,j-1)]==9)
                            break;
                    flag2=!flag2;
                }
                if(flag2)
                {
                    let fill = {fillX:j , fillY:i};
                    fillOption1.push(fill); 
                }
            }
        }

        for(let j=1 ; j<cols ; j++){     // fill from up wall
            let flag2 = false;
            for(let i=0; i<rows ; i++){
                if(board[realPlace(i,j)]==2 || board[realPlace(i,j)]==9)
                {
                    if(i!=29)
                        if(board[realPlace(i+1,j)]==2 || board[realPlace(i+1,j)]==9)
                            break;
                    flag2=!flag2;
                }
                   
                if(flag2)
                {
                    let fill = {fillX:j , fillY:i};
                    fillOption1.push(fill); 
                }
            }
        }

        for(let j=1 ; j<cols ; j++){     // fill from down wall
            let flag2 = false;
            for(let i=rows-1; i>=0 ; i--){
                if(board[realPlace(i,j)]==2 || board[realPlace(i,j)]==9)
                {
                    if(i!=0)
                        if(board[realPlace(i-1,j)]==2 || board[realPlace(i-1,j)]==9)
                            break;
                    flag2=!flag2;
                }
                   
                if(flag2)
                {
                    let fill = {fillX:j , fillY:i};
                    fillOption1.push(fill); 
                }
            }
        }

		// create arr with all cells that not include in the first option
        let existFlag = false;
        let count=0;
        for(let i = 0 ; i<rows ; i++)  
        {
             for(let j=0 ;j<cols  ;j++)
             {
                if(board[realPlace(i,j)]==0)
                {
                    count++;
                    for(let t = 0; t<fillOption1.length;t++)
                        if(fillOption1[t].fillY == i && fillOption1[t].fillX == j)
                            existFlag = true;
                    if(!existFlag)
                    {   
                        //existFlag = false;    
                        let fill = {fillX:j , fillY:i};
                        fillOption2.push(fill); 
                    }   
                }
                existFlag = false; 
             }
        }
		
        //console.log("Black count = "+count);
        if(fillOption2.length!=0)
            if(fillArrContains(fillOption2,ball1))	// if the ball is in option2 fill option1
                for(let i=0 ; i<fillOption1.length ; i++)
                board[realPlace(fillOption1[i].fillY,fillOption1[i].fillX)]=1;
			else
				for(let i=0 ; i<fillOption2.length ; i++)
					board[realPlace(fillOption2[i].fillY,fillOption2[i].fillX)]=1; 

        for(let i=0 ; i<rows ; i++)
            for(let j=0 ; j<cols ; j++)
        {    
            if(board[realPlace(i,j)]!=0)
            {
                if(blackNei(i,j))
                    board[realPlace(i,j)]=1;	// frame wall
                else
                    board[realPlace(i,j)]=3;	// dead space 
            }
        } 
    };

    // check if the ball is inside area
    let fillArrContains = function(arrFill , ball){
        ballX=ball.getX();
        ballY=ball.getY();
        for(let i=0 ; i<arrFill.length ; i++)
            if(arrFill[i].fillX == ballX && arrFill[i].fillY == ballY)
                return true;    // contains
        return false        // not contains
    }
   
    let getCheckLose = function(){
        return checkLose;
    }

	// check if there is a blanck neighbor
    let blackNei = function(i,j){
        if(i+1<=rows-1)
            if(board[realPlace(i+1,j)]==0)
                return true;
        if(i-1>=0)
            if(board[realPlace(i-1,j)]==0)
                return true;
        if(j+1<=cols-1)
            if(board[realPlace(i,j+1)]==0)
                return true;
        if(j-1>=0)
            if(board[realPlace(i,j-1)]==0)
                return true;
        if(i+1<=rows-1 && j+1<=cols-1)
            if(board[realPlace(i+1,j+1)]==0)
                return true;
        if(i+1<=rows-1 && j-1>=0)
            if(board[realPlace(i+1,j-1)]==0)
                return true;
        if(i-1>=0 && j-1>=0)
            if(board[realPlace(i-1,j-1)]==0)
                return true;
        if(i-1>=0 && j+1<=cols-1)
            if(board[realPlace(i-1,j+1)]==0)
                return true;
        return false;
    }

	// find and mark the path from end to start - recursive
    let traverse = function(xEnd, yEnd , xStart , yStart) {
        if(xEnd==xStart && yEnd==yStart) { 
            recursiveFlag=1;	// path found
        }
        else if(board[realPlace(yEnd,xEnd)] == 1 && recursiveFlag==0) {//} else if(this.maze[column][row] == 1) {
            board[realPlace(yEnd,xEnd)] = 9;	// the path from end to start sign by 9
            if(xEnd < cols - 1) {
                traverse(xEnd + 1, yEnd , xStart , yStart); 
            }
            if(yEnd < rows - 1) {
                traverse(xEnd, yEnd + 1, xStart , yStart); 
            }
            if(xEnd > 0) {
                traverse(xEnd-1, yEnd, xStart , yStart); 
            }
            if(yEnd > 0) {
                traverse(xEnd, yEnd-1, xStart , yStart);
            }
        }
    };

    return {update, draw, moveLeft, moveRight,moveDown,moveUp ,getCheckLose};
};