const scoreForShipShot = 100;
const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;

var score=0;

var masterFrameDelayTick=0;

window.onload = function() {
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);
	canvasContext = canvas.getContext("2d");
	loadImages();
}

function loadingDoneSoStartGame (){
	setInterval(update,1000/30);
	setInterval(shipSpawn,1000*2);
	cannonEndX = playerX = canvas.width/2;
	cannonEndY = playerY = canvas.height-playerHeight;
	document.addEventListener("keydown",keyPress);
	document.addEventListener("keyup",keyRelease);
}

function update() {
	clearScreen();
	handleInput();
	drawAll();
	moveAll();
}

function drawAll() {
	masterFrameDelayTick++;
	drawAndRemoveShips();
	drawAndRemoveAliens();
	drawAndRemoveShots();
	drawPlayer();
	debugDraw();
}

function moveAll() {
	moveShips();
	moveAliens();
	moveShots();
}

function resetGame() {
	shotList=[];
	shipList=[];
	alienList=[];
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
		canvasContext.fillText("ships: " + shipList.length,100,drawTextOutY);
		drawTextOutY+=lineHeight;
		canvasContext.fillText("aliens: " + alienList.length,100,drawTextOutY);
	}
	
}

function clearScreen() {
	canvasContext.fillStyle="black";
	canvasContext.fillRect(0,0,canvas.width,canvas.height);
}

