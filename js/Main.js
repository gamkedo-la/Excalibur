const scoreForShipShot = 100;
const scoreForMissileShot = 20;
const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;
var score=0;

var currentBackgroundFar = backgroundFarPic;
var	currentBackgroundMed = backgroundTitlePic;
var	currentBackgroundNear = backgroundNearPic;

var gameOverManager = new gameOverSequence();

var windowState = {
	inFocus : true, 
	help : false,
	mainMenu : true, 
};

var TitleTextX, subTitleTextX,opacity;

var gameUpdate;
var gameShipSpawn;
var gameGunnerSpawn;

var masterFrameDelayTick=0;
var canvas, canvasContext;
currentBackgroundMusic.loopSong(menuMusic);

window.onload = function () {
	window.addEventListener("focus", windowOnFocus);
 	window.addEventListener("blur", windowOnBlur);
	
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
	mainMenu.initialize();
};

function loadingDoneSoStartGame () {
	gameUpdate = setInterval(update, 1000/30);
}

function update() {
	if (windowState.inFocus){
		if(windowState.mainMenu){
			drawSkyGradient(); 
			canvasContext.drawImage(currentBackgroundFar,0,0);
			canvasContext.drawImage(currentBackgroundMed,0,0);
			colorText('Excalibur',TitleTextX,canvas.height/2-40 ,"white",mainMenu.titleFont,"center");
			colorText('Space Defence System',subTitleTextX ,canvas.height/2,"white",mainMenu.titleFont,"center");
			
			mainMenu.handleSliders();
			mainMenu.drawButtons(opacity);
				
				
			if(subTitleTextX <= canvas.width/2 - 12 ){
				subTitleTextX+=15;

			}
			if(TitleTextX >= canvas.width/2 + 10){
				TitleTextX-=15;
			}
			else if(!windowState.help){
				opacity = opacity + 0.009;
			}
		}
		else if(windowState.help){
			drawSkyGradient();  
			canvasContext.drawImage(backgroundFarPic,0,0);
			colorText('How To Play',canvas.width/2 ,130,"white","30px Tahoma","center",opacity);
			colorText("1) WASD or Arrow Keys for Movements",250 ,250 ,"white","15px Tahoma","left",opacity);
			colorText("2) Primary Mouse button for Shooting",250,280 ,"white","15px Tahoma","left",opacity);
			colorText("3) Tab to use secondary weapon",250,310 ,"white","15px Tahoma","left",opacity);
			colorText("4) P to pause game",250,340 ,"white","15px Tahoma","left",opacity);
			colorText('Press (Enter) to Start game',canvas.width/2 ,canvas.height/2 + 120,"white","20px Tahoma","center",opacity);
			opacity = opacity + 0.009;
		}
		else {
				if(!gameOverManager.gameOverPlaying) {
					drawScrollingBackground();
					handleInput();
					moveAll();
				}
				drawAll();
			if (!orchestratorMode) {
				checkFrameCount();
			} else {
				orchestratorFrameCount();
			}
		}		
	}
}

function drawAll() {
	masterFrameDelayTick++;
	if(gameOverManager.gameOverPlaying){
		gameOverManager.animateLosingScreen();
		return;
	}
	drawAndRemoveShips();
	drawAndRemoveMissiles();
	drawAndRemoveAliens();
	drawAndRemoveShots();
	drawPlayer();
	drawAndRemovePowerUps();
	drawScore();
	drawLives()
	drawExplosions();
}

function moveAll() {
	moveShips();
	moveMissiles();
	moveAliens();
	moveShots();
	movePowerUps();
	updateExplosions();
}

function resetGame() {
	clearInterval(gameShipSpawn);
	clearInterval(gameGunnerSpawn);
	clearInterval(gameUpdate);

	clearAllExplosions();
	
	currentBackgroundFar = backgroundFarPic;
	currentBackgroundMed = backgroundTitlePic;
	currentBackgroundNear = backgroundNearPic;
	
	windowState.mainMenu = true;
	windowState.help = false;
	orchestratorMode = false;
	assaultMode = false;
	
	isSpawningWave = false;
	waveCompleted = false;
	waveEndExcuted = false;
	waveStarted = false;
	isPaused = false;
	enableIntermission = false;
	
	currentSpawnType = 0;
	spawnFrameCount = 0;
	currentEnemyIndex = 0;
	currentStageIndex = 0;
	currentWaveIndex = 0;
	currentWave = currentWaveIndex + 1; 
	wave = [];
	createNewWave = [];
	
	shotList = [];
	shipList = [];
	alienList = [];
	missileList = [];
	
	resetPowerUps();
	score=0;
	playerHP = startHitpoints;
	
	TitleTextX = canvas.width;
	subTitleTextX = 0;
	opacity = 0;
	
	currentBackgroundMusic.loopSong(menuMusic);
	
	gameUpdate = setInterval(update, 1000/30);
}

function drawScore() {
	if (!orchestratorMode) {

			 colorText("score: " + score,canvas.width-20,30,"white","20px Arial","right");

	} else {
			
			 colorText("spawnFrameCount: " + orchestratorSpawnFrameCount,canvas.width - 10, 30,"white","20px Arial","right");
			 colorText("[1] for Paradropper",130,50,"white","15px Arial","right");
			 colorText("[2] for Gunner",97,70,"white","15px Arial","right");
			 colorText("[M] for Missile Strike",136,90,"white","15px Arial","right");
			 colorText("[C] to copy new Wave",148,110,"white","15px Arial","right");

	}

	if (debug) {
			
			var lineHeight = 15;
			var drawTextOutY = 100;
			colorText("hitpoints: " + playerHP,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("shots: " + shotList.length,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("ships: " + shipList.length,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("aliens: " + alienList.length,100,drawTextOutY,"cyan","15px Arial");

	}
}

function drawLives() {
    colorText("lives: " + playerHP,canvas.width-780,30,"white","20px Arial","left");
}

function showPausedScreen() {
    colorText("- P A U S E D -", canvas.width/2, canvas.height/2, "white", "40px Arial", "center");
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

// background sky (with time of day simulation gradient)
// scrolls through a super zoomed in lookup table (gradient texture)
function drawSkyGradient() {
	canvasContext.drawImage(
		timeOfDayGradient,
		((masterFrameDelayTick*0.2)%timeOfDayGradient.width),0,1,100, // source x,y,w,d (scroll source x over time)
		0,0,800,600); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
}

function drawScrollingBackground() {

	drawSkyGradient();

	// background terrain
	wrappedDraw(currentBackgroundFar, masterFrameDelayTick * 0.15);
	wrappedDraw(currentBackgroundMed, masterFrameDelayTick * 0.6);
	wrappedDraw(currentBackgroundNear, masterFrameDelayTick * 4.6);
}

function startGame() {
	windowState.help = false;
	windowState.mainMenu = false;
	
	changeBackground(currentStageIndex);
}

function openHelp() {
	if(isPaused) {
		return;
	}
	
	windowState.mainMenu = false;
	windowState.help = true;
}

function startOrchestratorMode() {
	if(windowState.mainMenu){
		startGame();
	}
	orchestratorMode = true;
}

function windowOnFocus() {
	currentBackgroundMusic.resumeSound();
	if(!windowState.inFocus) {
		windowState.inFocus = true;
		gameUpdate = setInterval(update, 1000/30);
		
		if (assaultMode){
			gameShipSpawn = setInterval(shipSpawn, 500);
			gameGunnerSpawn = setInterval(gunnerSpawn, 1500);
		}
		if (waveStarted) {
			resumeSound.play();
		}
	}
};

function windowOnBlur() { 
	currentBackgroundMusic.pauseSound();
	if (pauseOnLoseFocus && !isPaused) {
		clearInterval(gameShipSpawn);
		clearInterval(gameGunnerSpawn);
		windowState.inFocus = false;
		clearInterval(gameUpdate);
		
		if (waveStarted) {
			pauseSound.play();
			showPausedScreen();
		}
	}
};
