var debug = false;

const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;
var score=0;

var currentBackgroundFar = backgroundFarPic;
var	currentBackgroundMed = backgroundTitlePic;
var	currentBackgroundNear = backgroundNearPic;

var gameOverManager = new gameOverSequence();

var isPaused = false; 
var windowState = {
	inFocus : true, 
	help : false,
	mainMenu : true, 
};

var TitleTextX, subTitleTextX,opacity;

var gameUpdate;
var gameDropshipSpawn;
var gameGunshipSpawn;
var gameMissileSpawn;

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
	
	playerX = canvas.width/2;
	playerY = canvas.height-playerHeight/2;
	playerY + playerHeight/2;
	
	initializeInput();
	loadImages();
	initExplosions();
	mainMenu.initialize();
	initializeEnemyClasses();
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
			colorText("4) P to pause and resume game",250,340 ,"white","15px Tahoma","left",opacity);
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
			if (smartBombActive) {
				//Destroy all ships
				for (var ship of shipList) {
					ship.removeMe = true;
				}
				//Destroy all aliens
				for (var alien of alienList) {
					alien.removeMe = true;
				}
				smartBombActive = false;
			}
			if (!orchestratorMode && !carnageMode) {
				checkFrameCount();
			} else if (orchestratorMode && !carnageMode) {
				orchestratorFrameCount();
			} else if (!orchestratorMode && carnageMode) {
				carnageModeController();
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
	clearInterval(gameDropshipSpawn);
	clearInterval(gameGunshipSpawn);
	clearInterval(gameMissileSpawn);
	clearInterval(gameUpdate);

	clearAllExplosions();
	
	currentBackgroundFar = backgroundFarPic;
	currentBackgroundMed = backgroundTitlePic;
	currentBackgroundNear = backgroundNearPic;
	
	windowState.mainMenu = true;
	windowState.help = false;
	orchestratorMode = false;
	assaultMode = false;
	carnageMode = false;
	
	isSpawningWave = false;
	waveCompleted = false;
	waveEndExcuted = false;
	waveStarted = false;
	isPaused = false;
	enableIntermission = false;
	carnageStarted = false;
	
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
	playerX = canvas.width/2;
	playerHP = startHitpoints;
	playerInvulTimer = 0;
	
	TitleTextX = canvas.width;
	subTitleTextX = 0;
	opacity = 0;
	
	currentBackgroundMusic.loopSong(menuMusic);
	
	gameUpdate = setInterval(update, 1000/30);
}

function drawScore() {
	if (!orchestratorMode || carnageMode) {

			 colorText("score: " + score,canvas.width-20,30,"white","20px Arial","right");

	} else if (orchestratorMode && !carnageMode) {
			
			 colorText("spawnFrameCount: " + orchestratorSpawnFrameCount,canvas.width - 10, 30,"white","20px Arial","right");
			 colorText("[1] for Paradropper",130,50,"white","15px Arial","right");
			 colorText("[2] for Gunship",97,70,"white","15px Arial","right");
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
    //colorText("lives: " + playerHP,canvas.width-780,30,"white","20px Arial","left");
    var gap = 5;
    var cornerX = 30;
    var cornerY = 15;
    var maxHeartsToShow = 5;
    var heartsToShow = Math.min(playerHP, maxHeartsToShow);
    for(var i = 0; i < heartsToShow; i++) {
        canvasContext.drawImage(heartPic, cornerX + i * (heartPic.width + gap), cornerY);
    }
}

function tintScreen(){
    canvasContext.fillStyle = "black";
    canvasContext.globalAlpha = 0.2;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.globalAlpha = 1.0;
}

function showPausedScreen() {
    tintScreen();
    colorText("- P A U S E D -", canvas.width/2, canvas.height/2, "white", "40px Arial", "center");
}

// optimization todo: support wider background wrap but draw only on-screen portion
function wrappedDraw(whichImg,pixelOffset) {
	var wrappedOffset = Math.floor(pixelOffset % whichImg.width);
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

function togglePause(){
    var levelIsInPlay = assaultMode || waveStarted;
    if((!levelIsInPlay || windowState.help) && !orchestratorMode){
		console.log(waveStarted, windowState.help, orchestratorMode);	
        console.log("no pause");
        return;
    }

    isPaused = !isPaused;	
    if(isPaused) {
    	if(assaultMode) {
        clearInterval(gameDropshipSpawn);
        clearInterval(gameGunshipSpawn);
        clearInterval(gameMissileSpawn);
    	}
        showPausedScreen();
        pauseSound.play();
        clearInterval(gameUpdate);
    } else {
        gameUpdate = setInterval(update, 1000/30);
        if (assaultMode){
			gameDropshipSpawn = setInterval(dropshipSpawn, 500);
			gameGunshipSpawn = setInterval(gunshipSpawn, 1500);
			gameMissileSpawn = setInterval(missileSpawn, 2000);
		}
        resumeSound.play();
    }
}

function startOrchestratorMode() {
	if(windowState.mainMenu){
		startGame();
		orchestratorMode = true;
	}
}

function windowOnFocus() {
	currentBackgroundMusic.resumeSound();
	if(!windowState.inFocus) {
		windowState.inFocus = true;
		gameUpdate = setInterval(update, 1000/30);
		
		if (assaultMode){
			gameDropshipSpawn = setInterval(dropshipSpawn, 500);
			gameGunshipSpawn = setInterval(gunshipSpawn, 1500);
			gameMissileSpawn = setInterval(missileSpawn, 2000);
		}
		if (waveStarted && !gameOverManager.gameOverPlaying) {
			resumeSound.play();
		}
	}
}

function windowOnBlur() {
	if (!gameOverManager.gameOverPlaying && !windowState.mainMenu && !windowState.help && !isPaused) {
	    tintScreen();
		currentBackgroundMusic.pauseSound();
		if (!isPaused && !windowState.help) {
			clearInterval(gameDropshipSpawn);
			clearInterval(gameGunshipSpawn);
			clearInterval(gameMissileSpawn);
			windowState.inFocus = false;
			clearInterval(gameUpdate);
			
			if (waveStarted) {
				pauseSound.play();
				showPausedScreen();
			}
		}
	}
}
