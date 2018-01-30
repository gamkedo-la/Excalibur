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
	windowState.twoPlayerHelp = false;
	windowState.backgroundSelect = false;
	orchestratorMode = false;
	twoPlayerMode = false;
	assaultMode = false;
	carnageMode = false;
	gameRunning = false;
	
	isSpawningWave = false;
	waveCompleted = false;
	waveEndExcuted = false;
	waveStarted = false;
	isPaused = false;
	enableIntermission = false;
	carnageStarted = false;
	toggleCarnageModeSpawning = false;
	orchestratorWins = false;
	excaliburWins = false;
	scoreReached = false;
	
	currentSpawnType = 0;
	spawnFrameCount = 0;
	currentEnemyIndex = 0;
	currentStageIndex = 0;
	currentWaveIndex = 0;
	masterFrameDelayTick = 0;

	currentWave = currentWaveIndex + 1;
	fireMode = FIREMODE_SINGLE;

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