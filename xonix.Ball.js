xonix = window.xonix || {};
xonix.Ball = function(options) {
    let {board, x, y, width, height, cursor, checkLose} = options;
    const DX = 0.08, DY = 0.08, R = 5;
	let xDir = 1, yDir = -1;
	
	
    let update = function(delta) {
		x+=20*xDir;	// cross movement
		y+=20*yDir;
        if(board[realPlace(y/20,x/20)] == 2)	// ball hits the path
        {
            checkLose=true;
            return;
        }
        if(board[realPlace((y+20*yDir)/20,(x+20*xDir)/20)] == 1) // hits the frame, change directions
        {
            if(yDir==-1 && xDir==1)
            {
                if(board[realPlace(((y-20)/20),((x-20)/20))]==0)
                    xDir *= -1;
                
		        else if(board[realPlace(((y+20)/20),((x+20)/20))]==0) 
                    yDir *= -1;
                
                else   
                {
                    xDir *= -1;
                    yDir *= -1;
                }
            }

            else if(yDir==1 && xDir==1)
            {
                if(board[realPlace(((y-20)/20),((x+20)/20))]==0)
                    yDir *= -1;
                
		        else if(board[realPlace(((y+20)/20),((x-20)/20))]==0) 
                    xDir *= -1;

                else   
                {
                    xDir *= -1;
                    yDir *= -1;
                }
            }

            else if(yDir==1 && xDir==-1)
            {
                if(board[realPlace(((y+20)/20),((x+20)/20))]==0)
                    xDir *= -1;
                
		        else if(board[realPlace(((y-20)/20),((x-20)/20))]==0) 
                    yDir *= -1;

                else   
                {
                    xDir *= -1;
                    yDir *= -1;
                }
            }

            else if(yDir==-1 && xDir==-1)
            {
                if(board[realPlace(((y+20)/20),((x-20)/20))]==0)
                    yDir *= -1;
                
		        else if(board[realPlace(((y-20)/20),((x+20)/20))]==0) 
                    xDir *= -1;
                
                else   
                {
                    xDir *= -1;
                    yDir *= -1;
                }
            }

           
        }
            
	};
	
	let draw = function(context) {
		context.fillStyle = "white";
		context.beginPath();
        context.arc(x, y, 2 * R, 0, 2 * Math.PI);
        context.fill();
	}
    
    
    let realPlace = function(x,y){
        return x*(width/20)+y;
    };

    let getCheckLose = function(){
        return checkLose;
    }

    let getX = function(){
        return x/20;
    }

    let getY = function(){
        return y/20;
    }


    return {update, draw , getCheckLose, getX, getY};
};