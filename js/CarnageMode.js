var carnageMode = false;
var carnageStarted = false;

function carnageModeController() {
	if (shipList.length > 500 || missileList.length > 500) {
		clearInterval(gameDropshipSpawn);
		clearInterval(gameGunshipSpawn);
		clearInterval(gameMissileSpawn);
		carnageStarted = false;
	} else {
		carnage();
	}
}

function carnage() {
	if (carnageStarted) {
		return;
	}
	gameDropshipSpawn = setInterval(dropshipSpawn, 100);
	gameGunshipSpawn = setInterval(gunshipSpawn, 100);
	gameMissileSpawn = setInterval(missileSpawn, 100);
	carnageStarted = true;
};