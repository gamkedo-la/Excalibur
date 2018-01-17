var wave = [];
var currentWaveIndex = 0;
var currentWave = currentWaveIndex + 1;
var currentStageIndex = 0; 
var currentStage = currentStageIndex + 1;
var stageNames = ["Planet Zebes", "Inside Super Computer", "Crystalline Coast"];
var timeBetweenWaves = 25; // time in frames (30 frames/second)
var timeForText = 85; // time in frames (30 frames/second)
var spawnFrameCount = 0;
var currentSpawnType = 0;
var weaponFrameCount = 0;
var currentEnemyIndex = 0;

var isSpawningWave = false;
var waveCompleted = false;
var waveEndExcuted = false;
var waveStarted = false;
var enableIntermission = false;
var assaultMode = false;

const ZEBES_BACKGROUND = 0;
const COMPUTER_BACKGROUND = 1;
const BEACH_BACKGROUND = 2;

var currentBackground = ZEBES_BACKGROUND;

var stage1 = [stage1WaveNumber1,stage1WaveNumber2,stage1WaveNumber3];
var stage2 = [stage2WaveNumber1]
var stage3 = [stage3WaveNumber1]
var allStages = [stage1,stage2, stage3];

function checkFrameCount() {
	spawnFrameCount++;
	if(usingTimedWeapon) {
		weaponFrameCount++
	}
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
    if (waveStarted && shipList.length == 0 && alienList.length == 0
    	&& missileList.length == 0) {
    	shotList.length = 0;
		waveCompleted = true;
    }
    if (wave[currentEnemyIndex] == undefined) { // this is probably bad form - Terrence
    	return;
    }
    if (spawnFrameCount === wave[currentEnemyIndex].framesUntilSpawn) {
        currentSpawnType = wave[currentEnemyIndex].spawnType;
        spawnEnemy();
        spawnFrameCount = 0;
        currentEnemyIndex++;
        waveStarted = true;
        if (currentEnemyIndex >= wave.length) {
            currentEnemyIndex = 0;
            wave = [];
        }
    }
}

function waveStart() {
	if (allStages[currentStageIndex] == undefined) {
		assaultMode = true;
		currentBackground = ZEBES_BACKGROUND
		currentBackgroundFar = backgroundFarPic;
		currentBackgroundMed = backgroundMedPic;
		currentBackgroundNear = backgroundNearPic;
		if (spawnFrameCount < timeForText && !gameOverManager.gameOverPlaying) {
			canvasContext.font = "40px Tahoma";
			canvasContext.textAlign = "center";
			canvasContext.fillStyle = "white";
			canvasContext.fillText("Aliens Incoming!" ,canvas.width/2,canvas.height/2 -40);
			canvasContext.font = "30px Tahoma";
			canvasContext.fillText('All Out Assault!',canvas.width/2 ,canvas.height/2);
		} else if (spawnFrameCount > timeForText) {
		    gameDropshipSpawn = setInterval(dropshipSpawn, 500);
			gameGunshipSpawn = setInterval(gunshipSpawn, 1500);
			gameMissileSpawn = setInterval(missileSpawn, 2000);
			isSpawningWave = true;
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
		canvasContext.fillText('Wave ' + currentWave + " Complete!" ,canvas.width/2,canvas.height/2 -40);
		canvasContext.font = "30px Tahoma";
		canvasContext.fillText('Alien Invasion Repelled!',canvas.width/2 ,canvas.height/2);
	} else if (spawnFrameCount > timeForText) {
		spawnFrameCount = 0;
		waveCompleted = false;
		enableIntermission = true;
	}
}

function intermission() {
	if (spawnFrameCount > timeBetweenWaves) {
			currentWaveIndex++;
			currentWave++;
			spawnFrameCount = 0;
			enableIntermission = false;		
			waveEndExcuted = false;
			isSpawningWave = false;
		if (currentWaveIndex == allStages[currentStageIndex].length){
			currentStageIndex++;
			currentStage++;
			changeBackground(currentStageIndex);
			currentWaveIndex = 0;
			currentWave = currentWaveIndex + 1;
		}
	}
}

function changeBackground(stage) {
	if (!windowState.help && !windowState.mainMenu) {
        currentBackground = stage;
		if (currentBackground == ZEBES_BACKGROUND) {
			currentBackgroundMusic.loopSong(zebesBackgroundMusic);
			currentBackgroundFar = backgroundFarPic;
			currentBackgroundMed = backgroundMedPic;
			currentBackgroundNear = backgroundNearPic;
		}
		if (currentBackground == COMPUTER_BACKGROUND) {
			currentBackgroundMusic.loopSong(computerBackgroundMusic);
			currentBackgroundMed = computerBackgroundFarPic;
			currentBackgroundNear = computerBackgroundNearPic;
		}
		if (currentBackground == BEACH_BACKGROUND) {
			currentBackgroundMusic.loopSong(zebesBackgroundMusic);
			currentBackgroundFar = beachBackgroundFarPic;
			currentBackgroundMed = beachBackgroundMedPic;
			currentBackgroundNear = beachBackgroundNearPic;
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
    }
}