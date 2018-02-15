var carnageMode = false;
var carnageStarted = false;
var toggleCarnageModeSpawning = false;

var gunshipSpawnTimer = 150;
var dropshipSpawnTimer = 250;
var protectionShipSpawnTimer = 2500;
var missileSpawnTimer = 1100;

var carnageModeSpawnLimit = 300;
var scoreThresholdToIncreaseSpawning = 20000;
var scoreThresholdIncrease = 20000;

function carnageModeController() {
	carnageStarted = true;
	if (shipList.length > carnageModeSpawnLimit) {
		clearInterval(gameDropshipSpawn);
		clearInterval(gameGunshipSpawn);
		clearInterval(gameProtectorSpawn);
		clearInterval(gameMissileSpawn);
		toggleCarnageModeSpawning = false;
	} else {
		carnage();
		if (score >= scoreThresholdToIncreaseSpawning && gunshipSpawnTimer > 50) {
			dropshipSpawnTimer -= 10;
			gunshipSpawnTimer -= 10;
			protectionShipSpawnTimer -= 10;
			missileSpawnTimer -= 10;
			scoreThresholdToIncreaseSpawning += scoreThresholdIncrease;
			clearInterval(gameDropshipSpawn);
			clearInterval(gameGunshipSpawn);
			clearInterval(gameProtectorSpawn);
			clearInterval(gameMissileSpawn);
			gameDropshipSpawn = setInterval(dropshipSpawn, dropshipSpawnTimer);
			gameGunshipSpawn = setInterval(gunshipSpawn, gunshipSpawnTimer);
			gameProtectorSpawn = setInterval(protectionShipSpawn, protectionShipSpawnTimer);
			gameMissileSpawn = setInterval(missileSpawn, missileSpawnTimer);
			console.log("spawning times lowered!")
		}
	}
}

function carnage() {
	if (toggleCarnageModeSpawning) {
		return;
	}
	gameDropshipSpawn = setInterval(dropshipSpawn, dropshipSpawnTimer);
	gameGunshipSpawn = setInterval(gunshipSpawn, gunshipSpawnTimer);
	gameProtectorSpawn = setInterval(protectionShipSpawn, protectionShipSpawnTimer);
	gameMissileSpawn = setInterval(missileSpawn, missileSpawnTimer);
	toggleCarnageModeSpawning = true;
};