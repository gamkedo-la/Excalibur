const scoreForShipShot = 100;
const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;

var score=0;

var masterFrameDelayTick=0;
var canvas, canvasContext;

window.onload = function () {
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	document.body.appendChild(canvas);
	canvasContext = canvas.getContext("2d");
	loadImages();
};

function loadingDoneSoStartGame (){
	setInterval(update,1000/30);
	setInterval(shipSpawn,1000*2);
	setInterval(gunnerSpawn,3000*2);
	cannonEndX = playerX = canvas.width/2;
	cannonEndY = playerY = canvas.height-playerHeight;
	initializeInput();
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
	drawScore();
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

function drawScore() {
	canvasContext.save();
	canvasContext.font = "20px Arial";
	canvasContext.textAlign = "right";
	canvasContext.fillStyle = "white";
	canvasContext.fillText("score: " + score,canvas.width-20,30);
	canvasContext.restore();

	if (debug) {
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

// optimization todo: support wider background wrap but draw only on-screen portion
function wrappedDraw(whichImg,pixelOffset) {
	var wrappedOffset = pixelOffset % whichImg.width;
	canvasContext.drawImage(whichImg, 0,0, 
							whichImg.width-wrappedOffset,whichImg.height,
							wrappedOffset,0,
							whichImg.width-wrappedOffset,whichImg.height);
	canvasContext.drawImage(whichImg, whichImg.width-wrappedOffset,0, 
							wrappedOffset,whichImg.height,
							0,0,
							wrappedOffset,whichImg.height);
}

function clearScreen() {
	wrappedDraw(backgroundFarPic, masterFrameDelayTick * 0.15);

	wrappedDraw(backgroundMedPic, masterFrameDelayTick * 0.6);

	wrappedDraw(backgroundNearPic, masterFrameDelayTick * 4.6);
}
/*
hey chris I couldn't find the graphicsCommon.js file so i stuck this here for now

*/
//flip sprite to face mouse or player
function drawBitmapFlipped(graphic, atX, atY, flipToFaceLeft) {
		canvasContext.save();
  		canvasContext.translate(atX, atY);
		if(flipToFaceLeft) {
			canvasContext.scale(-1.0,1.0);
		}
		canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2);
		canvasContext.restore();
}

