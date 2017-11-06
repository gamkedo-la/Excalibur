window.onload = function() {
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);
	canvasContext = canvas.getContext("2d");
	setInterval(update,1000/30);
	setInterval(enemySpawn,1000*4);
	cEndX = px = canvas.width/2;
	cEndY = py = canvas.height-ph;
	document.addEventListener("keydown",keyPress);
	document.addEventListener("keyup",keyRelease);
}

function update() {
	clearScreen();

	handleInput();

	handleShots();

	handleShips();
	handleAliens();

	drawPlayer();

	debugDraw();
}

function resetGame() {
	shotList=[];
	enemyList=[];
	trooperList=[];
	score=0;
	playerHP = startHitpoints;
}

function debugDraw() {
	
	canvasContext.save();
	canvasContext.font = "20px Arial"
	canvasContext.textAlign = "right";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("score: " + score,canvas.width-20,30);
	canvasContext.restore();

	if(debug == true){
		canvasContext.fillStyle = "cyan";
		var lineHeight = 15;
		var drawTextOutY = 100;
		canvasContext.fillText("hitpoints: " + playerHP,100,drawTextOutY);
		drawTextOutY+=lineHeight;
		canvasContext.fillText("shots: " + shotList.length,100,drawTextOutY);
		drawTextOutY+=lineHeight;
		canvasContext.fillText("planes: " + enemyList.length,100,drawTextOutY);
		drawTextOutY+=lineHeight;
		canvasContext.fillText("troops: " + trooperList.length,100,drawTextOutY);
	}
	
}

function clearScreen() {
	canvasContext.fillStyle="black";
	canvasContext.fillRect(0,0,canvas.width,canvas.height);
}

