var carnageMode = false;
var carnageStarted = false;
var toggleCarnageModeSpawning = false;

var dropshipSpawnTimer = 150;
var gunshipSpawnTimer = 250;
var protectionShipSpawnTimer = 750;
var missileSpawnTimer = 1000;

var carnageModeSpawnLimit = 250;
var scoreThresholdToIncreaseSpawning = 20000;

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
		if (score > scoreThresholdToIncreaseSpawning && dropshipSpawnTimer > 50) {
			dropshipSpawnTimer -= 5;
			gunshipSpawnTimer -= 5;
			protectionShipSpawnTimer -= 5;
			missileSpawnTimer -= 5;
			scoreThresholdToIncreaseSpawning += scoreThresholdToIncreaseSpawning;
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