xonix = window.xonix || {};
xonix.Arena = function() {
    let canvas;
    let w, h;
    let ball1, cursor;
	let totalTime = 0, lastTimeStamp = 0;
	let FPS = 24;
    let timeFrame = 1000 / FPS;
	let explosions = [];
    let rows,cols;
    let board;
    let checkLose;

    let initModule = function() {
        this.canvas = document.getElementById("canvas");
        w = this.canvas.width;
        h = this.canvas.height;
        wInside = w-20;
        hInside = h-20;
        rows = h/20 , cols=w/20;
        console.log("Rows"+rows+"cols:"+cols);
        board=[];
        checkLose=false;
		
		// black screen
        for(let i=0 ; i<rows*cols ; i++)
            board.push(0); 
		
		//	create frame
        for(let j=0 ; j<cols ; j++){
            board[realPlace(0,j)]=1;
            board[realPlace(rows-1,j)]=1;
        }

        for(let i=0 ; i<rows ; i++){
            board[realPlace(i,0)]=1;
            board[realPlace(i,cols-1)]=1;
        }

        for(let i=0 ; i<rows ; i++)
        {
            for(let j=0 ; j<cols ; j++)
                console.log(board[realPlace(i,j)]);
        }
        
        console.log(board);
        ball1 = new xonix.Ball({board:board , x: w/2, y: h/2, width:w, height:h, checkLose:checkLose});
        cursor = new xonix.Cursor({board:board ,x : w/2, y: 0, width:w, height:h, checkLose:checkLose ,ball1});
      
        onkeydown = move;
		mainLoop(0);
	};
    
	
    let mainLoop = function(timeStamp) {
        totalTime += timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
        while(totalTime > timeFrame) {
            update(timeFrame);
            totalTime -= timeFrame;
        }
        draw();
        
        requestAnimationFrame(mainLoop);
    };
    
	
    let clearScreen = function() {
		let context = this.canvas.getContext('2d');
		context.clearRect(0, 0, w, h);
    };
    
    let update = function(delta) {
        ball1.update(delta);
        cursor.update(delta);
        
        if(cursor.getCheckLose()==true || ball1.getCheckLose()==true){
            alert("YOU LOST");
            initModule();
        }

        if(checkWin()){
            alert("YOU WON!!!");
            initModule();
        }
            
    
    };

    let draw = function() {
        let context = this.canvas.getContext('2d');
        clearScreen();
        for(let i=0 ; i<rows ; i++)
        {
            for(let j=0 ; j<cols ; j++)
            {
                if(board[realPlace(i,j)]==0)	// clear area
                    context.fillStyle="black";
                else if(board[realPlace(i,j)]==2)	// cursor path
                    context.fillStyle="blue";
                else if(board[realPlace(i,j)]==3)	// close area
                    context.fillStyle="yellow";
                else
                    context.fillStyle="red";	// frame = 1
                context.fillRect(j*20,i*20,20,20);
            }  
        }
        ball1.draw(context);
		cursor.draw(context);
    
    };
	
	// keyboard arrows	click event
    let move = function(e) {
        
        if(e.keyCode == 37)
            cursor.moveLeft();
        if(e.keyCode == 39)
            cursor.moveRight();
        if(e.keyCode == 38)
            cursor.moveUp();
        if(e.keyCode == 40)
            cursor.moveDown();;
    };
    
  
    let realPlace = function(i,j){
        return i*(cols)+j;
    }

	// if more then 80% filled , you won
    let checkWin = function(i,j){
        let countRed=0;
        for(let i=0; i<board.length ; i++)
            if(board[i] == 1 || board[i] == 3)
                countRed++;
        if(countRed>=board.length*0.8)
            return true;
        return false;
    }


    
    return {initModule};
}();