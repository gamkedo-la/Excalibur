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
const KEY_B = 66;
const KEY_C = 67;
const KEY_D = 68;
const KEY_H = 72;
const KEY_M = 77;
const KEY_O = 79;
const KEY_P = 80;
const KEY_Q = 81;  
const KEY_T = 84;

//for debugging
const KEY_K = 75;
const KEY_BACKSPACE = 8;
const KEY_TILDE = 192; // TODO: is the canon tilde or backtick

var holdFire, holdLeft, holdRight = false;
var rotateLeft, rotateRight = false;
var smartBombActive = false;

const FIREMODE_SINGLE = 0;
const FIREMODE_TWIN = 1;
const FIREMODE_SPLIT = 2;
const FIREMODE_WAVE = 3;
const FIREMODE_LASER = 4;
const MAX_FIREMODE = FIREMODE_LASER;
var fireMode = FIREMODE_SINGLE;

const CONTROL_SCHEME_KEYS_STATIONARY = 0;
const CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING = 1;

var controlScheme = CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING;

var mouseY = 0;
var mouseX = 0;
var mouseCannonY, mouseCannonX;

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
			canvas.addEventListener ("mouseout", onMouseUp);
			break;
	}
}

function handleInput() {
	if(holdFire) {
		switch(fireMode) {
			case FIREMODE_SINGLE:
				if(cannonReloadLeft <= 0) {
					cannonReloadLeft = CannonShotClass.reloadTime - playerUpgradeROF;
					
					var newShot = new CannonShotClass(cannonEndX, cannonEndY, cannonAngle);
					shotList.push(newShot);
					regularShotSound.play();
					shotsFired++;
					gunfireExplosion(cannonEndX,cannonEndY);
				}
				break;
			case FIREMODE_TWIN:
				if(cannonReloadLeft <= 0) {
					cannonReloadLeft = CannonShotClass.reloadTime - playerUpgradeROF;
					
					var shotStartOffsetX = Math.cos(cannonAngle+Math.PI/2) * 7;
					var shotStartOffsetY = Math.sin(cannonAngle+Math.PI/2) * 7;
					var newShot = new CannonShotClass(cannonEndX-shotStartOffsetX,
												cannonEndY-shotStartOffsetY, cannonAngle);
					shotList.push(newShot);
					newShot = new CannonShotClass(cannonEndX+shotStartOffsetX,
												cannonEndY+shotStartOffsetY, cannonAngle);
					shotList.push(newShot);
					regularShotSound.play();
					shotsFired++;
					gunfireExplosion(cannonEndX,cannonEndY);
				}
				break;
			case FIREMODE_SPLIT:
				if(cannonReloadLeft <= 0) {
					cannonReloadLeft = CannonShotClass.reloadTime - playerUpgradeROF;
					
					var forkAmtInRadians = 0.18;
					var newShot = new CannonShotClass(cannonEndX, cannonEndY,
						cannonAngle-forkAmtInRadians);
					shotList.push(newShot);
					newShot = new CannonShotClass(cannonEndX, cannonEndY,
						cannonAngle+forkAmtInRadians);
					shotList.push(newShot);
					newShot = new CannonShotClass(cannonEndX, cannonEndY,
						cannonAngle);
					shotList.push(newShot);
					regularShotSound.play();
					shotsFired++;
					gunfireExplosion(cannonEndX,cannonEndY);
				}
				break;
			case FIREMODE_WAVE:
				if(cannonReloadLeft <= 0) {
					cannonReloadLeft = WaveShotClass.reloadTime * (1.0-(playerUpgradeROF/(MAX_UPGRADES_PER_KIND+1)));
					
					var newShot = new WaveShotClass(cannonEndX, cannonEndY, cannonAngle);
					shotList.push(newShot);
					waveShotSound.play();
					shotsFired++;
					secondaryGunfireExplosion(cannonEndX,cannonEndY);
				}
				break;
			case FIREMODE_LASER:
				if(cannonReloadLeft <= 0) {
					cannonReloadLeft = LaserShotClass.reloadTime * (1.0-(playerUpgradeROF/(MAX_UPGRADES_PER_KIND+1)));
					// NOTE: compute cannonReloadLeft prior to laserShotClass, bases lifetime on it
					var newShot = new LaserShotClass(cannonEndX, cannonEndY, cannonAngle);
					shotList.push(newShot);
					waveShotSound.play();
					shotsFired++;
					secondaryGunfireExplosion(cannonEndX,cannonEndY);
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
			if(rotateLeft) {
				cannonAngle -= cannonAngleVelocity;
			}
			if(rotateRight) {
				cannonAngle += cannonAngleVelocity;
			}
			movePlayer();
			break;
		case CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING:
			var mouseCannonY = mouseY - playerY;
			var mouseCannonX = mouseX - playerX;

			cannonAngle = Math.atan2(mouseCannonY, mouseCannonX);

			movePlayer();
			break;
	}
	
	// This could likely be done using some kind of modulo angle formula
	if (cannonAngle < defaultCannonAng - cannonAngLimit || cannonAngle > Math.PI/2) {
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
            if(!gameOverManager.gameOverPlaying){
			togglePause();
            }
			break;
		case KEY_ENTER:
			if(windowState.mainMenu){
				if(firstLoad) {
					openHelp();
					firstLoad = false;
					return;
				} else {
					startGame();
				}
			}
			if(windowState.help){
				startGame();
			}
			if(gameOverManager.gameOverPlaying && gameOverManager.gameOverSummaryRendered) {
				gameOverManager.gameOverPlaying = false;
				gameOverManager.gameOverSummaryRendered = false;
				// TODO: put this stuff into the resetGame bit
				resetGame();
			}
			break;
        case KEY_K:
            if(!gameOverManager.gameOverPlaying && !windowState.mainMenu && !windowState.help && !isPaused){
             gameOverManager.startGameOverSequence();
            }
            break;
		case KEY_O:
			if (twoPlayerMode && !isPaused) {
				orchestratorMode = !orchestratorMode;
					startGame();
				if (!orchestratorMode) {
					score = 0;
				} else {
					orchestratorSpawnFrameCount = 0;
					shotsFired = 0;
				}
			}
			break;
		case KEY_T:
			if (windowState.mainMenu) {
				startTwoPlayerMode();
			} else if (windowState.twoPlayerHelp)  {
				windowState.backgroundSelect = true;
				windowState.twoPlayerHelp = false;
				currentBackgroundMed = backgroundMedPic;
				currentBackgroundMusic.loopSong(zebesBackgroundMusic);
			} else if (windowState.backgroundSelect) {
				windowState.backgroundSelect = false;
				twoPlayerMode = true;
				startOrchestratorMode();
				gameRunning = true;	
			}
			break;
		case DIGIT_1:
			if (windowState.backgroundSelect) {
				currentStageIndex = 0;
				changeBackground(currentStageIndex);
			} else if(twoPlayerMode && !isPaused) {
				orchestratorCurrentSpawnType = PLANE_PARADROPPER;
				if (orchestratorMode) {
					enemyData.spawnType = orchestratorCurrentSpawnType;
					enemyData.framesUntilSpawn = orchestratorSpawnFrameCount;
					createNewWave.push(enemyData);
					enemyData = { 
						spawnType: null, 
						framesUntilSpawn: null 
					}
				}
				orchestratorSpawnEnemy();
			} else if(isUpgradeTime && playerUpgradeSpeed<MAX_UPGRADES_PER_KIND) {
		 		playerUpgradeSpeed++;
				isUpgradeTime = false;
			}
			break;
		case DIGIT_2:
			if (windowState.backgroundSelect) {
				currentStageIndex = 1;
				changeBackground(currentStageIndex);
			} else if (orchestratorMode) {
				orchestratorCurrentSpawnType = PLANE_GUNSHIP;
				enemyData.spawnType = orchestratorCurrentSpawnType;
				enemyData.framesUntilSpawn = orchestratorSpawnFrameCount;
				createNewWave.push(enemyData);
				enemyData = { 
					spawnType: null, 
					framesUntilSpawn: null 
				}
				orchestratorSpawnEnemy();
			} else if(isUpgradeTime && playerUpgradeROF<MAX_UPGRADES_PER_KIND) {
		 		playerUpgradeROF++;
				isUpgradeTime = false;
			}
			break;
		case DIGIT_3:
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
			} else if (windowState.backgroundSelect) {
				currentStageIndex = 2;
				changeBackground(currentStageIndex);
			} else if(isUpgradeTime && playerUpgradeHealth<MAX_UPGRADES_PER_KIND) {
		 		playerHP++;
		 		playerUpgradeHealth++;
				isUpgradeTime = false;
			}
			break;
		case DIGIT_4: // testing key
			if (windowState.backgroundSelect) {
				currentStageIndex = 3;
				changeBackground(currentStageIndex);
			} else if (controlScheme == CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING && !twoPlayerMode) {
				controlScheme = CONTROL_SCHEME_KEYS_STATIONARY;
			} else {
				controlScheme = CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING;
			}
			break;
		case DIGIT_5:
			if (windowState.backgroundSelect) {
				currentStageIndex = 4;
				changeBackground(currentStageIndex);
			} else if (!windowState.backgroundSelect) {
				fireMode = (evt.keyCode - DIGIT_3);
				console.log("weapon mode change to: " +
				fireMode);
			}
			break;
		case DIGIT_6:
			if (windowState.backgroundSelect) {
				currentStageIndex = 5;
				changeBackground(currentStageIndex);
			} else if (!windowState.backgroundSelect) {
				fireMode = (evt.keyCode - DIGIT_3);
				console.log("weapon mode change to: " +
				fireMode);
			}
			break;
		case DIGIT_7:
			fireMode = (evt.keyCode - DIGIT_3);
			console.log("weapon mode change to: " +
			fireMode);
			break;
		case KEY_M:
			break;
		case KEY_H:
            if(!gameOverManager.gameOverPlaying){
			openHelp();
            }
			break;
		case KEY_ESCAPE:
            if(!gameOverManager.gameOverPlaying && !windowState.mainMenu && !windowState.help){
			resetGame();
            }
			break;
		case KEY_TAB:
			if (!assaultMode) {
				console.log("level skipping");
				if(allStages[currentStageIndex]) {
					currentWaveIndex = (allStages[currentStageIndex].length) - 1;
				}
				enableIntermission = true; 
				spawnFrameCount = timeForText
				waveEnd();
				shipList = [];
				wave = [];
				//intermission(true);
			}
			break;
		case KEY_SPACE:
			holdFire = true;
			break;
		case KEY_LEFT:
			holdLeft = true;
			break;
		case KEY_A:
			if (twoPlayerMode && !isPaused && !orchestratorMode) {
				orchestratorCurrentSpawnType = MISSILE_STRIKE;
				orchestratorSpawnEnemy();
			} else if(controlScheme == CONTROL_SCHEME_KEYS_STATIONARY && (!twoPlayerMode || orchestratorMode)) {
				rotateLeft = true;
			} else if(controlScheme == CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING && (!twoPlayerMode || orchestratorMode)) {
				holdLeft = true;
			}
			break;
		case KEY_Q:
			if (twoPlayerMode && !isPaused && !orchestratorMode) {
				orchestratorCurrentSpawnType = PLANE_GUNSHIP;
				orchestratorSpawnEnemy();
			}
			break;
		case KEY_RIGHT:
			holdRight = true;
			break;
		case KEY_D:
			if (controlScheme == CONTROL_SCHEME_KEYS_STATIONARY && (!twoPlayerMode || orchestratorMode)) {
				rotateRight = true;
			} else if (controlScheme == CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING && (!twoPlayerMode || orchestratorMode)) {
				holdRight = true;
			}
			break;
		case DIGIT_0:
			debug = !debug;
			break;
		case KEY_TILDE:
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
			holdLeft = false;
			break;
		case KEY_A:
			if (controlScheme == CONTROL_SCHEME_KEYS_STATIONARY && (!twoPlayerMode || orchestratorMode)) {
				rotateLeft = false;
			} else if (!twoPlayerMode || orchestratorMode) {
				holdLeft = false;
			}
			break;
		case KEY_B:
			smartBombActive = true;
			break;
		case KEY_RIGHT:
			holdRight = false;
			break;
		case KEY_D:
			if (controlScheme == CONTROL_SCHEME_KEYS_STATIONARY && (!twoPlayerMode || orchestratorMode)) {
				rotateRight = false;
			} else if (!twoPlayerMode || orchestratorMode) {
				holdRight = false;
			}
			break;
        case KEY_BACKSPACE:
            playerHP = 3;
            break;
      	case KEY_C:
      		if(orchestratorMode) {
      			var waveString = "";
      			var enemyType = "";
      			for(var i = 0; i < createNewWave.length; i++) {
      				if (createNewWave[i].spawnType == PLANE_PARADROPPER) {
      					enemyType = "PLANE_PARADROPPER";
      				} else if (createNewWave[i].spawnType == PLANE_GUNSHIP) {
      					enemyType = "PLANE_GUNSHIP";
      				} else if (createNewWave[i].spawnType == MISSILE_STRIKE) {
      					enemyType = "MISSILE_STRIKE";
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
							"\n//Wave arrays are in AllWaves.js" + 
							"\n//Don't forget to change this wave's var name so that all # are numbers" + 
							"\n//and to add this wave into the proper stage array in" +
							"\n//EnemyWavesController - Terrence";
	        	copyTextToClipboard(waveString);
	       	} else if (windowState.mainMenu) {
	       		startCarnage();
	       	}
	    	break;
	}
}

function calculateMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
    //console.log(Math.floor(mouseX));
}

function onMouseDown(evt) {
	evt.preventDefault();
	switch (evt.button) { //switch in case more mouse buttons are added
		case 0:
			holdFire=true;
			
			if(windowState.mainMenu) {
				mainMenu.checkButtons();
			} else if (gameOverManager.gameOverPlaying && gameOverManager.gameOverSummaryRendered) {
				gameOverManager.gameOverPlaying = false;
				gameOverManager.gameOverSummaryRendered = false;
				resetGame();
			} else if (windowState.help) {
				resetGame();
			}
			break;
	}
}

function onMouseUp(evt) {
	switch (evt.button) {
		case 0:
			holdFire=false;
			
			if(windowState.mainMenu) {
				mainMenu.releaseSliders();
			}
			break;
	}
}

function mouseInside(x, y, width, height) {
	return mouseX > x && mouseX < x + width && mouseY > y	&& mouseY < y + height;
}
