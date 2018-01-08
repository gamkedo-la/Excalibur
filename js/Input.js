const KEY_TAB = 9;
const KEY_ENTER = 13;
const KEY_ESCAPE = 27;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const DIGIT_0 = 48; //only for debug
const DIGIT_1 = 49;
const DIGIT_2 = 50;

const DIGIT_3 = 51;
const DIGIT_4 = 52;
const DIGIT_5 = 53;
const DIGIT_6 = 54;
const DIGIT_7 = 55;

const DIGIT_8 = 56;
const DIGIT_9 = 57;

const KEY_PLUS = 107;
const KEY_MINUS = 109;

const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_H = 72;
const KEY_M = 77;
const KEY_O = 79;
const KEY_P = 80; 

const pauseOnLoseFocus = true;

var holdFire, holdLeft, holdRight = false;

const FIREMODE_SINGLE = 0;
const FIREMODE_TWIN = 1;
const FIREMODE_SPLIT = 2;
const FIREMODE_WAVE = 3;
const FIREMODE_LASER = 4;
var fireMode = FIREMODE_SINGLE;

var debug = false;

const CONTROL_SCHEME_KEYS_STATIONARY = 0;
const CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING = 1;

var controlScheme = CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING;

var mouseY = 0;
var mouseX = 0;
var mouseCannonY, mouseCannonX;

var isPaused = false; 

function initializeInput() {
	document.addEventListener("keydown",keyPress);
	document.addEventListener("keyup",keyRelease);

	switch(controlScheme) {
		case CONTROL_SCHEME_KEYS_STATIONARY:
			console.log("Using control scheme: arrow/WASD keys only");
			break;
		case CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING:
			console.log("Using control scheme: arrow/WASD keys steer, mouse aims");
			canvas.addEventListener('mousemove', calculateMousePos);
			canvas.addEventListener('mousedown', onMouseDown);
			canvas.addEventListener('mouseup', onMouseUp);
			break;
	}
}

function togglePause(){
    if(!waveStarted || windowState.help){
        return;
    }

    isPaused = !isPaused;
		
    if(isPaused) {
        clearInterval(gameShipSpawn);
        clearInterval(gameGunnerSpawn);
        showPausedScreen();
        pauseSound.play();
        clearInterval(gameUpdate);
    } else {
        gameUpdate = setInterval(update, 1000/30);
        resumeSound.play();
    }
}

function handleInput() {
	if(holdFire) {
		switch(fireMode) {
			case FIREMODE_SINGLE:
				if(cannonReloadLeft <= 0) {
					var newShot = new shotClass(cannonEndX, cannonEndY, cannonAngle, cannonShotSpeed);
					shotList.push(newShot);
					regularShotSound.play();
					gunfireExplosion(cannonEndX,cannonEndY);
					cannonReloadLeft = cannonReloadFrames;
				}
				break;
			case FIREMODE_TWIN:
				if(cannonReloadLeft <= 0) {
					var shotStartOffsetX = Math.cos(cannonAngle+Math.PI/2) * 7;
					var shotStartOffsetY = Math.sin(cannonAngle+Math.PI/2) * 7;
					var newShot = new shotClass(cannonEndX-shotStartOffsetX,
												cannonEndY-shotStartOffsetY, cannonAngle, cannonShotSpeed);
					shotList.push(newShot);
					newShot = new shotClass(cannonEndX+shotStartOffsetX,
												cannonEndY+shotStartOffsetY, cannonAngle, cannonShotSpeed);
					shotList.push(newShot);
					regularShotSound.play();
					gunfireExplosion(cannonEndX,cannonEndY);
					cannonReloadLeft = cannonReloadFrames;
				}
				break;
			case FIREMODE_SPLIT:
				if(cannonReloadLeft <= 0) {
					var forkAmtInRadians = 0.18;
					var newShot = new shotClass(cannonEndX, cannonEndY,
						cannonAngle-forkAmtInRadians, cannonShotSpeed);
					shotList.push(newShot);
					newShot = new shotClass(cannonEndX, cannonEndY,
						cannonAngle+forkAmtInRadians, cannonShotSpeed);
					shotList.push(newShot);
					newShot = new shotClass(cannonEndX, cannonEndY,
						cannonAngle, cannonShotSpeed);
					shotList.push(newShot);
					regularShotSound.play();
					gunfireExplosion(cannonEndX,cannonEndY);
					cannonReloadLeft = cannonReloadFrames;
				}
				break;			break;
			case FIREMODE_WAVE:
				if(cannonReloadLeft <= 0) {
					usingTimedWeapon = true;
					var newShot = new waveShotClass(cannonEndX, cannonEndY, cannonAngle, cannonWaveShotSpeed);
					shotList.push(newShot);
					waveShotSound.play();
					secondaryGunfireExplosion(cannonEndX,cannonEndY);
					cannonReloadLeft = cannonWaveReloadFrames;
				}
				break;
			case FIREMODE_LASER:
				if(cannonReloadLeft <= 0) {
					usingTimedWeapon = true;
					var newShot = new laserShotClass(cannonEndX, cannonEndY, cannonAngle, 0);
					shotList.push(newShot);
					waveShotSound.play();
					secondaryGunfireExplosion(cannonEndX,cannonEndY);
					cannonReloadLeft = cannonLaserReloadFrames;
				}
				break;
			default:
				console.log("fire mode not yet implemented: " + fireMode);
				break;
		}

	}
	if(cannonReloadLeft>0) {
		cannonReloadLeft--;
	}
	switch(controlScheme) {
		case CONTROL_SCHEME_KEYS_STATIONARY:
			if(holdLeft) {
				cannonAngle -= cannonAngleVelocity;
			}
			if(holdRight) {
				cannonAngle += cannonAngleVelocity;
			}
			break;
		case CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING:
			var mouseCannonY = mouseY - playerY;
			var mouseCannonX = mouseX - playerX;

			// cannon was flipping left-to-right when mouse goes below deck
			if (mouseCannonY > 0 && mouseCannonX < 0) {
				mouseCannonY = -mouseCannonY;
			}

      	cannonAngle = Math.atan2(mouseCannonY, mouseCannonX);

			movePlayer();
			break;
	}

	if (cannonAngle < defaultCannonAng - cannonAngLimit) {
		cannonAngle = defaultCannonAng - cannonAngLimit;
	} else 	if (cannonAngle > defaultCannonAng + cannonAngLimit) {
		cannonAngle = defaultCannonAng + cannonAngLimit;
	}
}

function keyPress(evt) {
	// TODO: test for game controls instead, for now let's just re-enable function keys
	if (evt.key.toLowerCase().substr(0, 1) != "f") {
		evt.preventDefault();
	}

	switch (evt.keyCode) {
		case KEY_P:
			togglePause();
			break;
		case KEY_ENTER:
			if(windowState.mainMenu){
				startGame();
			}
			if(windowState.help){
				startGame();
			}
			if(gameOverManager.gameOverPlaying) {
				gameOverManager.gameOverPlaying = false;
				resetGame();
			}
			break;
		case KEY_O:
			startOrchestratorMode();
			break;
		case DIGIT_1:
			if(orchestratorMode) {
				orchestratorCurrentSpawnType = PLANE_PARADROPPER;
				enemyData.spawnType = orchestratorCurrentSpawnType;
				enemyData.framesUntilSpawn = orchestratorSpawnFrameCount;
				createNewWave.push(enemyData);
				enemyData = { 
					spawnType: null, 
					framesUntilSpawn: null 
				}
				orchestratorSpawnEnemy();
			}
			break;
		case DIGIT_2:
			if(orchestratorMode) {
				orchestratorCurrentSpawnType = PLANE_GUNNER;
				enemyData.spawnType = orchestratorCurrentSpawnType;
				enemyData.framesUntilSpawn = orchestratorSpawnFrameCount;
				createNewWave.push(enemyData);
				enemyData = { 
					spawnType: null, 
					framesUntilSpawn: null 
				}
				orchestratorSpawnEnemy();
			}
			break;
		case KEY_M:
			if(orchestratorMode) {
				orchestratorCurrentSpawnType = MISSILE_STRIKE;
				enemyData.spawnType = orchestratorCurrentSpawnType;
				enemyData.framesUntilSpawn = orchestratorSpawnFrameCount;
				createNewWave.push(enemyData);
				enemyData = { 
					spawnType: null, 
					framesUntilSpawn: null 
				}
				orchestratorSpawnEnemy();
			}
			break;
		case DIGIT_3:
		case DIGIT_4:
		case DIGIT_5:
		case DIGIT_6:
		case DIGIT_7:
			fireMode = (evt.keyCode - DIGIT_3);
			console.log("weapon mode change to: " +
			fireMode);
			break;

		case KEY_H:
			openHelp();
			break;
		case KEY_ESCAPE:
			resetGame();
			break;
		case KEY_TAB:
			fireMode = FIREMODE_WAVE;
			break;
		case KEY_SPACE:
			holdFire = true;
			break;
		case KEY_LEFT:
		case KEY_A:
			holdLeft = true;
			break;
		case KEY_RIGHT:
		case KEY_D:
			holdRight = true;
			break;
		case DIGIT_0:
			debug = !debug;
			break;
			
		case DIGIT_9:
			toggleMute();
			break;
		case KEY_PLUS:
			turnVolumeUp();
			break;
		case KEY_MINUS:
			turnVolumeDown();
			break;
	}
}
function keyRelease(evt) {
	switch(evt.keyCode) {
		case KEY_SPACE:
			holdFire = false;
			break;
		case KEY_LEFT:
		case KEY_A:
			holdLeft = false;
			break;
		case KEY_RIGHT:
		case KEY_D:
			holdRight = false;
			break;
      	case KEY_C:
      		if(orchestratorMode) {
      			var waveString = "";
      			var enemyType = "";
      			for(var i = 0; i < createNewWave.length; i++) {
      				if (createNewWave[i].spawnType == 1) {
      					enemyType = "PLANE_PARADROPPER";
      				} else if (createNewWave[i].spawnType == 2) {
      					enemyType = "PLANE_GUNNER";
      				}
    				if (i == (createNewWave.length) - 1) {
      					waveString += "    { spawnType: " + enemyType + ", framesUntilSpawn: " +
      									createNewWave[i].framesUntilSpawn + " }\n";
      				} else {
						waveString += "    { spawnType: " + enemyType + ", framesUntilSpawn: " +
	      								createNewWave[i].framesUntilSpawn + " },\n";
      				}
				}
      			waveString = waveString.slice(0,-1);
				waveString = "var stage#WaveNumber# = [ \n" + waveString + "\n];" + 
							 "\n//Don't forget to change this wave's var name so that all # are numbers" + 
							 "\n//and to add this wave into the proper stage array in" 
							 "\n//EnemyWavesController - Terrence";
	        	copyTextToClipboard(waveString);
	       	}
	    	break;
	}
}

function calculateMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}

function onMouseDown(evt) {
	evt.preventDefault();
	switch (evt.button) { //switch in case more mouse buttons are added
		case 0:
			holdFire=true;
			
			if(windowState.mainMenu) {
				mainMenu.checkButtons();
			}
			break;
	}
}

function onMouseUp(evt) {
	switch (evt.button) {
		case 0:
			holdFire=false;
			break;
	}
}

function mouseInside(x, y, width, height) {
	return mouseX > x && mouseX < x + width && mouseY > y	&& mouseY < y + height;
}
