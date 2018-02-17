var wave = [];
var currentWaveIndex = 0;
var currentWave = currentWaveIndex + 1;
var currentStageIndex = 5; // for debugging ending
var currentStage = currentStageIndex + 1;
var stageNames = ["Planet Zebes", "Inside Super Computer", "Crystalline Coast", "Fantasy Zone", "Starfield", "Black Hole"];
var timeBetweenWaves = 25; // time in frames (30 frames/second)
var timeForText = 85; // time in frames (30 frames/second)
var spawnFrameCount = 0;
var currentSpawnType = 0;
var currentEnemyIndex = 0;
var waveProgress = 0;
var enemiesSpawned = 0;

var isSpawningWave = false;
var waveCompleted = false;
var waveEndExcuted = false;
var waveStarted = false;
var spawningFinished = false;
var enableIntermission = false;
var assaultMode = false;
var endingEnabled = false;

const ZEBES_BACKGROUND = 0;
const COMPUTER_BACKGROUND = 1;
const BEACH_BACKGROUND = 2;
const FANTASY_BACKGROUND = 3;
const STARS_BACKGROUND = 4;
const BLACK_HOLE_BACKGROUND = 5;
const ENDING = 6;

var currentBackground = ZEBES_BACKGROUND;

var stage1 = [easyLevel,stage1WaveNumber2,];
var stage2 = [protectorIntro,stage1WaveNumber3];
var stage3 = [stage2WaveNumber1,stage3WaveNumber1];
var stage4 = [easyMedMostlyGunshipsMixedLevel,mediumHardPlanesMix];
var stage5 = [lateStageToughMixLevel,missileFlurryLevel];
var stage6 = [longBusyAirdropProtectorsLate];
var allStages = [stage1,stage2, stage3, stage4, stage5, stage6];

var isUpgradeTime = false;

function waveControllerStart() {
	if(isUpgradeTime) {
		if(gameOverManager.gameOverPlaying) {
			isUpgradeTime = false;
		} else {
			var canUpSpeed = playerUpgradeSpeed<MAX_UPGRADES_PER_KIND,
				canUpROF=playerUpgradeROF<MAX_UPGRADES_PER_KIND,
				canUpHealth=playerUpgradeHealth<MAX_UPGRADES_PER_KIND;
			if(canUpHealth == false && canUpROF == false && canUpSpeed == false) {
				isUpgradeTime = false;
			} else {
				canvasContext.font = "40px Tahoma";
				canvasContext.textAlign = "center";
				canvasContext.fillStyle = "white";
				var textLineSkip = 40;
				var textLineY = canvas.height/2 - textLineSkip *3;
				canvasContext.fillText("Time for an upgrade!",canvas.width/2,textLineY);
				textLineY+= textLineSkip * 2;
				if(canUpSpeed) {
					canvasContext.fillText("1. Dodge Speed ("+playerUpgradeSpeed+"/"+MAX_UPGRADES_PER_KIND+")",canvas.width/2,textLineY);
				}
				textLineY+= textLineSkip;
				if(canUpROF) {
					canvasContext.fillText("2. Rate of Fire ("+playerUpgradeROF+"/"+MAX_UPGRADES_PER_KIND+")" ,canvas.width/2,textLineY);
				}
				textLineY+= textLineSkip;
				if(canUpHealth) {
					canvasContext.fillText("3. Extra Health ("+playerUpgradeHealth+"/"+MAX_UPGRADES_PER_KIND+")" ,canvas.width/2,textLineY);
				}
				textLineY+= textLineSkip*2;
				canvasContext.fillText('Type '+(canUpSpeed ? '1 ' : "")+(canUpROF ? '2 ' : "")+(canUpHealth ? '3 ' : "")+'to choose...',canvas.width/2 ,textLineY);
				return;
			}
		} // end of else (wasn't in game over)
	} // showing upgrade offer

	spawnFrameCount++;
    if (wave.length < 1) {
    	if (!isSpawningWave) {
            waveStart();
        } else if (waveCompleted) {
        	waveEnd();
    	} else if (enableIntermission) {
    		//handleCutscenesAndStuff();
    		intermission();
    	}
    }
    if (spawningFinished && shipList.length == 0 && alienList.length == 0
    	&& missileList.length == 0) {
    	shotList.length = 0;
		waveCompleted = true;
    }
    if (wave[currentEnemyIndex] == undefined) { // this is probably bad form - Terrence
    	return;
    }
    if (wave[currentEnemyIndex].framesUntilSpawn <= 0) {
    	console.log('not a possible framesUntilSpawn interger')
    }
    if (spawnFrameCount === wave[currentEnemyIndex].framesUntilSpawn) {
        currentSpawnType = wave[currentEnemyIndex].spawnType;
        spawnEnemy();
        spawnFrameCount = 0;
        currentEnemyIndex++;
        enemiesSpawned++
        waveProgress = (enemiesSpawned/wave.length) * 100;
        if (enemiesSpawned/wave.length == 1) {
        	spawningFinished = true;
        }
        waveStarted = true;
        if (currentEnemyIndex >= wave.length) {
            currentEnemyIndex = 0;
            wave = [];
        }
	}
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
}

function waveStart() {
	if (currentStageIndex == ENDING) {
		endingEnabled = true;
		//return;
		// end game code goes here
		if (opacity > 1) {
			windowState.endingScreen = true;
			gameRunning = false;
			currentBackgroundMusic.loopSong(gameOverMusic);
		}
		if (spawnFrameCount > 5 && windowState.endingScreen == false) {
			canvasContext.globalAlpha = opacity;
    		drawRect(0,0, canvas.width, canvas.height, "black");
    		opacity += 0.09;
    		spawnFrameCount = 0
    	}
	} else if (allStages[currentStageIndex][currentWaveIndex]) {
		if (spawnFrameCount < timeForText && !gameOverManager.gameOverPlaying) {
			canvasContext.font = "40px Tahoma";
			canvasContext.textAlign = "center";
			canvasContext.fillStyle = "white";
			canvasContext.fillText(stageNames[currentStageIndex],canvas.width/2,canvas.height/2 -80);
			canvasContext.fillText('Wave ' + currentWave + " Incoming" ,canvas.width/2,canvas.height/2 -40);
			canvasContext.font = "30px Tahoma";
			canvasContext.fillText('Prepare Excalibur S.D.S!',canvas.width/2 ,canvas.height/2);
		} else if (spawnFrameCount > timeForText) {
		   	wave = allStages[currentStageIndex][currentWaveIndex];
		    spawnFrameCount = 0;
		    isSpawningWave = true;
		}
	} // end of else if
} // end of waveStart

function waveEnd() {
	if (!waveEndExcuted){
		spawnFrameCount = 0;
		waveEndExcuted = true;
		waveStarted = false;
		return;
	}
	if (spawnFrameCount < timeForText && !gameOverManager.gameOverPlaying) {
		canvasContext.font = "40px Tahoma";
		canvasContext.textAlign = "center";
		canvasContext.fillStyle = "white";
		canvasContext.fillText(stageNames[currentStageIndex],canvas.width/2,canvas.height/2 -80);
		canvasContext.fillText("Wave " + currentWave + " Complete!" ,canvas.width/2,canvas.height/2 -40);
		canvasContext.font = "30px Tahoma";
		canvasContext.fillText('Alien Invasion Repelled!',canvas.width/2 ,canvas.height/2);
	} else if (spawnFrameCount > timeForText) {
		spawnFrameCount = 0;
		waveCompleted = false;
		spawningFinished = false;
		if (currentStageIndex != 5) {
		isUpgradeTime = true;
		}
		enableIntermission = true;
	}
}

function intermission(forceSkip) {
	if (spawnFrameCount > timeBetweenWaves || forceSkip == true) {
		waveProgress = 0;
	 	enemiesSpawned = 0;
		currentWaveIndex++;
		currentWave++;
		enableIntermission = false;		
		waveEndExcuted = false;
		isSpawningWave = false;
		if (currentWaveIndex == allStages[currentStageIndex].length){
			if (currentStageIndex == BLACK_HOLE_BACKGROUND) {
				currentStageIndex++;
				opacity = 0;
				return;
			}
			currentStageIndex++;
			currentStage++;
			changeBackground(currentStageIndex);
			currentWaveIndex = 0;
			currentWave = currentWaveIndex + 1;
			spawnFrameCount = 0;
		} else {
			return;
		}
	}
}

function changeBackground(stage) {
	if (!windowState.help && !windowState.mainMenu) {
        currentBackground = stage;
		switch (currentBackground) {
			case ZEBES_BACKGROUND:
				currentBackgroundMusic.loopSong(zebesBackgroundMusic);
				currentBackgroundFar = backgroundFarPic;
				currentBackgroundMed = backgroundMedPic;
				currentBackgroundNear = backgroundNearPic;
				currentTankCannon = tankCannonPicZebes; // grey placeholder
				 
				break;
			case COMPUTER_BACKGROUND:
				currentBackgroundMusic.loopSong(computerBackgroundMusic);
				currentBackgroundMed = computerBackgroundFarPic;
				currentBackgroundNear = computerBackgroundNearPic;
				currentTankCannon = tankCannonPicComputer; // green placeholder
				 
				break;
			case BEACH_BACKGROUND:
				currentBackgroundMusic.loopSong(zebesBackgroundMusic);
				currentBackgroundFar = beachBackgroundFarPic;
				currentBackgroundMed = beachBackgroundMedPic;
				currentBackgroundNear = beachBackgroundNearPic;
				currentTankCannon = tankCannonPicBeach; // red placeholder 
				 
				break;

			case FANTASY_BACKGROUND:
				currentBackgroundMusic.loopSong(computerBackgroundMusic);
				currentBackgroundFar = fantasyFarPic;
				currentBackgroundMed = fantasyMedPic;
				currentBackgroundNear = fantasyNearPic;
				currentTankCannon = tankCannonPicFantasy; // orange placeholder
				 
        		break;
			case STARS_BACKGROUND:
				currentBackgroundMusic.loopSong(computerBackgroundMusic);
				currentBackgroundFar = starryBackgroundFarPic;
				currentBackgroundMed = starryBackgroundMidPic;
				currentBackgroundNear = starryBackgroundNearPic;
				currentTankCannon = tankCannonPicStars; //purple placeholder 
				 
        		break;
        	case BLACK_HOLE_BACKGROUND:
				currentBackgroundMusic.loopSong(computerBackgroundMusic);
				currentBackgroundFar = blackHoleBaseBG;
				currentBackgroundMed = emptyImageElement;
				currentBackgroundNear = emptyImageElement;
				currentBackgroundObjects = [];
				currentTankCannon = tankCannonPicBlackHole; //yellow placeholder
				 
        		break;
		}
	}
};
	

function spawnEnemy() {
    if (currentSpawnType == PLANE_PARADROPPER) {
        dropshipSpawn();
    } else if (currentSpawnType == PLANE_GUNSHIP) {
        gunshipSpawn();
    } else if (currentSpawnType == MISSILE_STRIKE) {
        missileSpawn();
    } else if (currentSpawnType == PLANE_PROTECT) {
        protectionShipSpawn();
    }
}