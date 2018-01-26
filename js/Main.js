var debug = false;

const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;
var score=0;

var currentBackgroundFar = backgroundFarPic;
var	currentBackgroundMed = backgroundTitlePic;
var	currentBackgroundNear = backgroundNearPic;

var gameOverManager = new gameOverSequence();

var firstLoad = true;
var isPaused = false; 
var windowState = {
	inFocus : true, 
	help : false,
	twoPlayerHelp : false,
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

var timeStarted;
var timeStartedActive;
var timeElapsedInSeconds = 0;
var frameCount = 0;

window.onload = function () {
	window.addEventListener("focus", windowOnFocus);
 	window.addEventListener("blur", windowOnBlur);
	
	canvas = document.createElement("canvas");
	canvasContext = canvas.getContext("2d");
	document.body.appendChild(canvas);
	canvas.width = 800;
	canvas.height = 600;
	drawRect(0,0,canvas.width, canvas.height, "black");
	colorText('LOADING...',canvas.width/2 , canvas.height/2,"white","30px Tahoma","center", 1);
	
	TitleTextX = canvas.width;
	subTitleTextX = 0;
	opacity = 0;
		
	playerX = canvas.width/2;
	playerY = canvas.height-playerHeight/2;
	playerY + playerHeight/2;
	
	initializeInput();
	loadImages();
	initExplosions();
	mainMenu.initialize();
	initializeEnemyClasses();
	initializeShotClasses();
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
			opacity = 1;
			drawSkyGradient(); 
			canvasContext.drawImage(currentBackgroundFar,0,0);
			colorText('How To Play',canvas.width/2 ,100,"white","30px Tahoma","center",opacity);
			colorText("1) Press 4 to switch between input options:",250,150 ,"white","15px Tahoma","left",opacity);
			colorText(" Default Inputs: A/D or arrows for left/right, mouse to aim tank cannon, mouse click or spacebar for shooting",70,180 ,"white","15px Tahoma","left",opacity);
			colorText(" Optional Inputs: Arrows for left/right, A/D for moving cannon left/right, spacebar for shooting",70,210 ,"white","15px Tahoma","left",opacity);
			colorText("2) Pick-up power-ups using Excalibur",250,240 ,"white","15px Tahoma","left",opacity);
			canvasContext.drawImage(firemodePowerUpPic, 500, 223);
			canvasContext.drawImage(shieldPowerUpPic, 535, 227);
			canvasContext.drawImage(healthPowerUpPic, 562, 227);
			canvasContext.drawImage(maxHealthPowerUpPic, 590, 227);
			colorText("3) P to pause and resume game",250,270 ,"white","15px Tahoma","left",opacity);
			colorText("4) Tab to skip levels",250,300 ,"white","15px Tahoma","left",opacity); // TODO: remove for release
			colorText('Press [Enter] to Start game',canvas.width/2 , 500,"white","30px Tahoma","center",opacity);
		}
		else if (windowState.twoPlayerHelp) {
			opacity = 1;
			drawSkyGradient(); 
			canvasContext.drawImage(currentBackgroundFar,0,0);
			colorText('How To Play',canvas.width/2 ,100,"white","30px Tahoma","center",opacity);
			colorText("Excalibur Controls: ",70,150 ,"Chartreuse","15px Tahoma","left",opacity);
			colorText("Arrows for left/right, Mouse to aim cannon, mouse click or spacebar for shooting",70,180 ,"white","15px Tahoma","left",opacity);
			colorText("Orchestrator Controls: ",70,210 ,"Chartreuse","15px Tahoma","left",opacity);
			colorText("Spawn Enemies using 1,2 and M ",70,240 ,"white","15px Tahoma","left",opacity);
			colorText("Pick-up power-ups using Excalibur",250,270 ,"white","15px Tahoma","left",opacity);
			canvasContext.drawImage(firemodePowerUpPic, 478, 253);
			canvasContext.drawImage(shieldPowerUpPic, 513, 257);
			canvasContext.drawImage(healthPowerUpPic, 540, 257);
			canvasContext.drawImage(maxHealthPowerUpPic, 567, 257);
			colorText("P to pause and resume game",250,300 ,"white","15px Tahoma","left",opacity);
			colorText('Press [T] to Duel!',canvas.width/2 , 500,"white","30px Tahoma","center",opacity);
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
			if (!twoPlayerMode && !carnageMode) {
				checkFrameCount();
			} else if (twoPlayerMode) {
				orchestratorFrameCount();
			} else if (carnageMode) {
				carnageModeController();
				cannonReloadFrames = 3;
				cannonWaveReloadFrames = 5;
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

function drawScore() {
	if (!orchestratorMode) {
			 colorText("Score: " + numberWithCommas(score),canvas.width-20,30,"white","20px Arial","right");
	}
	if (twoPlayerMode) {
		colorText("[1] for Paradropper",127,50,"white","15px Arial","right");
		colorText("[2] for Gunship",100,70,"white","15px Arial","right");
		colorText("[M] for Missile Strike",136,90,"white","15px Arial","right");
		colorText("[ESC] to return to Main Menu",195,110,"white","15px Arial","right");
		if (orchestratorMode) {	
			colorText("[C] to copy new Wave",148,130,"fuchsia","15px Arial","right");
				
			colorText("spawnFrameCount: " + orchestratorSpawnFrameCount,canvas.width - 10, 30,"white","20px Arial","right");

			colorText("frameCount: " + frameCount, canvas.width - 10, 50, "white", "20px Arial", "right");
			colorText("Time Elapsed: " + timeElapsedInSeconds.toFixed(1), canvas.width - 10, 70, "white", "20px Arial", "right");
			colorText("Frame Rate: " + (frameCount / timeElapsedInSeconds).toFixed(1), canvas.width - 10, 90, "white", "20px Arial", "right");

			colorText("Shots Fired: " + shotsFired, canvas.width - 10, 110, "white", "20px Arial", "right");
			colorText("Number Of Hits: " + shotsHit, canvas.width - 10, 130, "white", "20px Arial", "right");
			colorText("Ships Hit: " + shotsHitShips, canvas.width - 10, 150, "white", "20px Arial", "right");
			colorText("Aliens Hit: " + shotsHitAliens, canvas.width - 10, 170, "white", "20px Arial", "right");
			colorText("Parachutes Hit: " + shotsHitParachutes, canvas.width - 10, 190, "white", "20px Arial", "right");
		}
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

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawLives() {
    //colorText("lives: " + playerHP,canvas.width-780,30,"white","20px Arial","left");
    var gap = 5;
    var cornerX = 10;
    var cornerY = 8;
    var maxHeartsToShow = startHitpoints+playerUpgradeHealth;
    for(var i = 0; i < maxHeartsToShow; i++) {
        canvasContext.drawImage(
        	(i < playerHP ? heartPic : heartlessPic)
        	, cornerX + i * (heartPic.width + gap), cornerY);
    }
}

function tintScreen(){
    canvasContext.fillStyle = "black";
    canvasContext.globalAlpha = 0.2;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
	canvasContext.globalAlpha = 1.0;
	timeStartedActive = new Date().getTime(); // TODO: make a centralised variable reset
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
		(Math.floor(masterFrameDelayTick*0.2)%timeOfDayGradient.width),0,1,100, // source x,y,w,d (scroll source x over time)
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

	timeStarted = new Date().getTime();
	timeStartedActive = timeStarted;
	timeElapsedInSeconds = 0;
	frameCount = 0;
	shotsFired = 0;
	shotsHit = 0;
	shotsHitShips = 0;
	shotsHitAliens = 0;
	shotsHitParachutes = 0;
}

function openHelp() {
	if(isPaused) {
		return;
	}
	windowState.mainMenu = false;
	windowState.help = true;
}

function togglePause(){
    var levelIsInPlay = assaultMode || waveStarted || carnageStarted || twoPlayerMode;
    if((!levelIsInPlay || windowState.help) && !orchestratorMode){
		console.log(waveStarted, windowState.help, orchestratorMode, twoPlayerMode);	
        console.log("no pause");
        return;
    }

    isPaused = !isPaused;	
    if(isPaused) {
    	if(assaultMode || carnageStarted) {
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
		} else if (carnageStarted) {
			gameDropshipSpawn = setInterval(dropshipSpawn, 75);
			gameGunshipSpawn = setInterval(gunshipSpawn, 75);
			gameMissileSpawn = setInterval(missileSpawn, 500);
		}
        resumeSound.play();
		timeStartedActive = new Date().getTime();
    }
}

function startOrchestratorMode() {
	if(windowState.twoPlayerHelp){
		startGame();
		twoPlayerMode = true;
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
		} else if (carnageStarted) {
			gameDropshipSpawn = setInterval(dropshipSpawn, 75);
			gameGunshipSpawn = setInterval(gunshipSpawn, 75);
			gameMissileSpawn = setInterval(missileSpawn, 500);
		}
		if (waveStarted && !gameOverManager.gameOverPlaying) {
			resumeSound.play();
		}
		timeStartedActive = new Date().getTime();
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
