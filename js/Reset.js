function resetGame() {
	clearInterval(gameDropshipSpawn);
	clearInterval(gameGunshipSpawn);
	clearInterval(gameMissileSpawn);
	clearInterval(gameUpdate);

	clearAllExplosions();
	
	currentBackgroundFar = backgroundFarPic;
	currentBackgroundMed = backgroundTitlePic;
	currentBackgroundNear = backgroundNearPic;
	
	windowState.mainMenu = true;
	windowState.help = false;
	orchestratorMode = false;
	assaultMode = false;
	carnageMode = false;
	
	isSpawningWave = false;
	waveCompleted = false;
	waveEndExcuted = false;
	waveStarted = false;
	isPaused = false;
	enableIntermission = false;
	carnageStarted = false;
	toggleCarnageModeSpawning = false;
	
	currentSpawnType = 0;
	spawnFrameCount = 0;
	currentEnemyIndex = 0;
	currentStageIndex = 0;
	currentWaveIndex = 0;
	currentWave = currentWaveIndex + 1; 
	wave = [];
	createNewWave = [];
	
	shotList = [];
	shipList = [];
	alienList = [];
	missileList = [];
	
	resetPlayer();
	
	TitleTextX = canvas.width;
	subTitleTextX = 0;
	opacity = 0;
	
	currentBackgroundMusic.loopSong(menuMusic);
	
	gameUpdate = setInterval(update, 1000/30);
}