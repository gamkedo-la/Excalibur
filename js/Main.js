const scoreForShipShot = 100;
const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;
var score=0;

var windowState = {
	inFocus : true, 
	help : false,
	firstLoad : true, 
	help: false
}

var TitleTextX, subTitleTextX,opacity;

var gameUpdate
var gameShipSpawn
var gameGunnerSpawn
var doingGameOver = false;

var masterFrameDelayTick=0;
var canvas, canvasContext;

window.onload = function () {
	canvas = document.createElement("canvas");
	canvas.width = 800;
	canvas.height = 600;
	TitleTextX = canvas.width;
	subTitleTextX = 0;
	opacity = 0;
	document.body.appendChild(canvas);
	canvasContext = canvas.getContext("2d");
	cannonEndX = playerX = canvas.width/2;
	cannonEndY = playerY = canvas.height-playerHeight;
	initializeInput();
	loadImages();
	initExplosions();
};

function loadingDoneSoStartGame () {
	gameUpdate = setInterval(update, 1000/30);
}

function update() {
	if (windowState.inFocus){
		if(windowState.firstLoad){

			 canvasContext.drawImage(backgroundFarPic,0,0);
			 canvasContext.drawImage(backgroundMedPic,0,0);
			 canvasContext.save();
			 canvasContext.font = "40px Tahoma";
			 canvasContext.textAlign = "center";
			 canvasContext.fillStyle = "white";
			 canvasContext.fillText('Excalibur',TitleTextX,canvas.height/2 -40);
			 canvasContext.font = "25px Tahoma";
			 canvasContext.fillText('Space Defence System',subTitleTextX ,canvas.height/2);
			 canvasContext.font = "15px Tahoma";
			 canvasContext.globalAlpha = opacity;
			 canvasContext.fillText("[H] for Help",canvas.width/2  - 5,canvas.height/2  + 80);
			 canvasContext.fillText("[Enter] to Play",canvas.width/2  - 5,canvas.height/2  + 100);
			 canvasContext.fillText("[O] for Orchestrator Mode",canvas.width/2  - 5,canvas.height/2  + 120);
			 canvasContext.restore();

			 if(subTitleTextX <= canvas.width/2 - 12 ){
			 	subTitleTextX+=15;

			 }
			 if(TitleTextX >= canvas.width/2 + 10){
			 	TitleTextX-=15
			 }
			 else{
				opacity = opacity + 0.009
			 }
		}
		if(windowState.help){
			 canvasContext.drawImage(backgroundFarPic,0,0);
			 canvasContext.save();
			 canvasContext.globalAlpha = opacity;
			 canvasContext.font = "30px Tahoma";
			 canvasContext.textAlign = "center";
			 canvasContext.fillStyle = "white";
			 canvasContext.fillText('How To Play',canvas.width/2 ,130);
			 
			 canvasContext.textAlign = "left";
			 canvasContext.font = "15px Tahoma";
			 canvasContext.fillText("1) WASD or Arrow Keys for Movements",250 ,250  );
			 canvasContext.fillText("2) Primary Mouse button for Shooting",250,280);
			 canvasContext.fillText("3) Tab to use secondary weapon",250,310);

			 canvasContext.textAlign = "center"; 
			 canvasContext.font = "20px Tahoma";
			 canvasContext.fillText('Press (Enter) to Start game',canvas.width/2 ,canvas.height/2 + 120);

			 canvasContext.restore();
			 opacity = opacity + 0.002
		}

		else if(!windowState.help && !windowState.firstLoad){
				renderScreen();
				handleInput();
				drawAll();
				moveAll();
			if (!orchestratorMode) {
				checkFrameCount();
			} else {
				orchestratorFrameCount();
			}
		}		
	}
}

function drawAll() {
	if(doingGameOver){
		gameOver();
		return;
	}
	masterFrameDelayTick++;
	drawAndRemoveShips();
	drawAndRemoveAliens();
	drawAndRemoveShots();
	drawPlayer();
	drawAndRemovePowerUps();
	drawScore();
	drawExplosions();
}

function moveAll() {
	moveShips();
	moveAliens();
	moveShots();
	movePowerUps();
	updateExplosions();
}

function resetGame() {
	clearInterval(gameShipSpawn);
	clearInterval(gameGunnerSpawn);
	windowState.firstLoad = true;
	assaultMode = false;
	isSpawningWave = false;
	waveCompleted = false;
	waveEndExcuted = false;
	waveStarted = false;
	enableIntermission = false;
	currentSpawnType = 0;
	spawnFrameCount = 0;
	currentEnemyIndex = 0;
	currentWaveIndex = 0;
	currentWave = currentWaveIndex + 1; 
	wave = [];
	shotList = [];
	shipList = [];
	alienList = [];
	resetPowerUps();
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
	var drawSize = (whichImg.width-wrappedOffset);
	if(drawSize<whichImg.width) { // avoids Firefox issue on 0 image dim
		canvasContext.drawImage(whichImg, drawSize,0, 
			wrappedOffset,whichImg.height,
			0,0,
			wrappedOffset,whichImg.height);
	}
}

function renderScreen() {
	wrappedDraw(backgroundFarPic, masterFrameDelayTick * 0.15);

	wrappedDraw(backgroundMedPic, masterFrameDelayTick * 0.6);

	wrappedDraw(backgroundNearPic, masterFrameDelayTick * 4.6);
}
