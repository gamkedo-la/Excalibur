var carnageMode = false;
var carnageStarted = false;
var toggleCarnageModeSpawning = false;

function carnageModeController() {
	carnageStarted = true;
	if (shipList.length > 200) {
		clearInterval(gameDropshipSpawn);
		clearInterval(gameGunshipSpawn);
		clearInterval(gameMissileSpawn);
		toggleCarnageModeSpawning = false;
	} else {
		carnage();
	}
}

function carnage() {
	if (toggleCarnageModeSpawning) {
		return;
	}
	gameDropshipSpawn = setInterval(dropshipSpawn, 75);
	gameGunshipSpawn = setInterval(gunshipSpawn, 75);
	gameMissileSpawn = setInterval(missileSpawn, 500);
	toggleCarnageModeSpawning = true;
};