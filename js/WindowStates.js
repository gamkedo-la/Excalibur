var firstLoad = true;
var isPaused = false; 
var windowState = {
	inFocus : true, 
	help : false,
	twoPlayerHelp : false,
	backgroundSelect : false,
	mainMenu : true, 
};
var TitleTextX, subTitleTextX,opacity;

function mainMenuStates() {
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
		colorText("1) Press [4] to switch between input options:",250,150 ,"white","15px Tahoma","left",opacity);
		colorText(" Default Inputs: A/D or arrows for left/right, mouse to aim tank cannon, mouse click or spacebar for shooting",70,180 ,"white","15px Tahoma","left",opacity);
		colorText(" Optional Inputs: Arrows for left/right, A/D for moving cannon left/right, spacebar for shooting",70,210 ,"white","15px Tahoma","left",opacity);
		colorText("2) Pick-up power-ups using Excalibur",250,240 ,"white","15px Tahoma","left",opacity);
		canvasContext.drawImage(firemodePowerUpPic, 500, 223);
		canvasContext.drawImage(shieldPowerUpPic, 535, 227);
		canvasContext.drawImage(healthPowerUpPic, 562, 227);
		canvasContext.drawImage(maxHealthPowerUpPic, 590, 227);
		colorText("3) [P] to pause and resume game",250,270 ,"white","15px Tahoma","left",opacity);
		colorText("4) Tab to skip levels",250,300 ,"white","15px Tahoma","left",opacity); // TODO: remove for release
		colorText('Devs: [`] (backtick/tilde) for debug info', canvas.width/2, 400, "white", "15px Tahoma", "center",opacity); // TODO: remove for release
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
		colorText("Spawn Enemies using 1,Q, and A ",70,240 ,"white","15px Tahoma","left",opacity);
		colorText("Pick-up power-ups using Excalibur",250,270 ,"white","15px Tahoma","left",opacity);
		canvasContext.drawImage(firemodePowerUpPic, 478, 253);
		canvasContext.drawImage(shieldPowerUpPic, 513, 257);
		canvasContext.drawImage(healthPowerUpPic, 540, 257);
		canvasContext.drawImage(maxHealthPowerUpPic, 567, 257);
		colorText("P to pause and resume game",250,300 ,"white","15px Tahoma","left",opacity);
		colorText('Press [T] to Proceed',canvas.width/2 , 500,"white","30px Tahoma","center",opacity);
	}
	else if (windowState.backgroundSelect) {
		drawSkyGradient();
		canvasContext.drawImage(currentBackgroundFar,0,0);
		canvasContext.drawImage(currentBackgroundMed,0,0);
		canvasContext.drawImage(currentBackgroundNear,0,0);
		tintScreen();
		tintScreen();
		colorText("Select Background: ",canvas.width/2 ,100,"white","30px Tahoma","center",opacity);
		colorText(stageNames[currentStageIndex],canvas.width/2 ,150,"white","30px Tahoma","center",opacity);
		colorText("[1] for Planet Zebes",30,200 ,"white","15px Tahoma","left",opacity);
		colorText("[2] for Inside Super Computer",30,230 ,"white","15px Tahoma","left",opacity);
		colorText("[3] for Crystalline Coast",30,260 ,"white","15px Tahoma","left",opacity);
		colorText("[4] for Fantasy Zone",30,290 ,"white","15px Tahoma","left",opacity);
		colorText("[5] for Starfield",30,320 ,"white","15px Tahoma","left",opacity);
		colorText('Press [T] to Duel!',canvas.width/2 , 500,"white","30px Tahoma","center",opacity);
	}
}

function openHelp() {
	if(isPaused) {
		return;
	}
	windowState.mainMenu = false;
	windowState.help = true;
}

function startCarnage() {
	if(isPaused) {
		return;
	}
	windowState.mainMenu = false;
	carnageMode = true;
	playerUpgradeSpeed = 3;
	playerUpgradeROF = 3;
	startGame();
}

function startTwoPlayerMode() {
	if(isPaused) {
		return;
	}
	windowState.mainMenu = false;
	windowState.twoPlayerHelp = true;
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