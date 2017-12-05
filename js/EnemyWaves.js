const PLANE_PARADROPPER = 1;
const PLANE_GUNNER = 2;

var wave = [];
var currentWaveIndex = 0;
var currentWave = currentWaveIndex + 1; 
var timeBetweenWaves = 60; // time in frames (30 frames/second)
var timeForText = 90; // time in frames (30 frames/second)

var currentSpawnType = 0;
var spawnFrameCount = 0;
var weaponFrameCount = 0;
var currentEnemyIndex = 0;

var isSpawningWave = false;
var waveCompleted = false;
var waveEndExcuted = false;
var waveStarted = false;
var enableIntermission = false;
var assaultMode = false;

var waveNumber1 = [
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 10 }
];

var waveNumber2 = [
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 }
];

var allWaves = [waveNumber1,waveNumber2];

function checkFrameCount() {
	spawnFrameCount++;
	if(usingTimedWeapon) {
		weaponFrameCount++
	}
	/*if (spawnFrameCount % 5 == 0) {
		console.log("spawnFrameCount: " + spawnFrameCount);
	}*/
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
    if (waveStarted && shipList.length == 0 && alienList.length == 0) {
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
	if (allWaves[currentWaveIndex]) {
		if (spawnFrameCount < timeForText) {
			canvasContext.save();
			canvasContext.font = "40px Tahoma";
			canvasContext.textAlign = "center";
			canvasContext.fillStyle = "white";
			canvasContext.fillText('Wave ' + currentWave + " Incoming" ,canvas.width/2,canvas.height/2 -40);
			canvasContext.font = "30px Tahoma";
			canvasContext.fillText('Prepare Excalibur S.D.S!',canvas.width/2 ,canvas.height/2);
			canvasContext.restore();
		} else if (spawnFrameCount > timeForText) {
		   	wave = allWaves[currentWaveIndex];
		    spawnFrameCount = 0;
		    isSpawningWave = true;
		}
	} else if (assaultMode) {
		if (spawnFrameCount < timeForText) {
			canvasContext.save();
			canvasContext.font = "40px Tahoma";
			canvasContext.textAlign = "center";
			canvasContext.fillStyle = "white";
			canvasContext.fillText("Aliens Incoming!" ,canvas.width/2,canvas.height/2 -40);
			canvasContext.font = "30px Tahoma";
			canvasContext.fillText('All Out Assault!',canvas.width/2 ,canvas.height/2);
			canvasContext.restore();
		} else if (spawnFrameCount > timeForText) {
		    gameShipSpawn = setInterval(shipSpawn, 1000);
			gameGunnerSpawn = setInterval(gunnerSpawn, 3000);
			isSpawningWave = true;
		}
	} // end of else
} // end of waveStart

function waveEnd() {
	if (!waveEndExcuted){
		spawnFrameCount = 0;
		waveEndExcuted = true;
		waveStarted = false;
		return;
	}
	if (spawnFrameCount < timeForText) {
		canvasContext.save();
		canvasContext.font = "40px Tahoma";
		canvasContext.textAlign = "center";
		canvasContext.fillStyle = "white";
		canvasContext.fillText('Wave ' + currentWave + " Complete!" ,canvas.width/2,canvas.height/2 -40);
		canvasContext.font = "30px Tahoma";
		canvasContext.fillText('Alien Invasion Repelled!',canvas.width/2 ,canvas.height/2);
		canvasContext.restore();
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
		if (!allWaves[currentWaveIndex]){
		assaultMode = true;
		}
	}
}

function spawnEnemy() {
    if (currentSpawnType == PLANE_PARADROPPER) {
        shipSpawn();
    } else if (currentSpawnType == PLANE_GUNNER) {
        gunnerSpawn();
    }
}