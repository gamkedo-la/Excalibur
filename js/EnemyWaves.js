const PLANE_PARADROPPER = 1;
const PLANE_GUNNER = 2;
var wave = [];
var allWaves = [waveNumber1];
var currentWave = 0;

var waveNumber1 =
[ {spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30},
{spawnType: PLANE_GUNNER, framesUntilSpawn: 5},
{spawnType: PLANE_GUNNER, framesUntilSpawn: 5},
{spawnType: PLANE_PARADROPPER, framesUntilSpawn: 10},
{spawnType: PLANE_PARADROPPER, framesUntilSpawn: 25} ];

var currentSpawnIndex = 0;
var spawnFrameCount = 0;

function spawnWave(waveNumber) {
	wave = [];
	wave = waveNumber;
	for (var enemyIndex = 0; enemyIndex < wave.length; enemyIndex++) {
		if (wave[enemyIndex].framesUntilSpawn == spawnFrameCount) {
			currentSpawnIndex = wave[enemyIndex].spawnType;
			spawnFrameCount = 0;
			spawnEnemy();
		}
	}
}

function spawnFrameCounter() {
	spawnFrameCount++;
	if (spawnFrameCount % 5 == 0) {
	console.log("spawnFrameCount: " + spawnFrameCount);
	}
}

function spawnEnemy() {
	if (currentSpawnIndex = PLANE_PARADROPPER){
		shipSpawn();
	} else if (currentSpawnIndex = PLANE_GUNNER){
		gunnerSpawn();
	}
}