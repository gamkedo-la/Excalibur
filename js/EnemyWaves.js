const PLANE_PARADROPPER = 1;
const PLANE_GUNNER = 2;
var wave = [];
var currentWave = 0;

var waveNumber1 = [
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 30 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_GUNNER, framesUntilSpawn: 5 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 10 },
    { spawnType: PLANE_PARADROPPER, framesUntilSpawn: 25 }
];

var allWaves = [waveNumber1];

var currentSpawnType = 0;
var spawnFrameCount = 0;
var isSpawningWave = false;
var currentEnemyIndex = 0;

function spawnWave() {
    if (isSpawningWave) return;
    isSpawningWave = true;
    wave = [];

    if (allWaves[currentWave]) {
        wave = allWaves[currentWave];
    }

    currentEnemyIndex = 0;
}

function checkFrameCount() {
    if (wave.length < 1) return;
    spawnFrameCount++;
    if (spawnFrameCount === wave[currentEnemyIndex].framesUntilSpawn) {
        currentSpawnType = wave[currentEnemyIndex].spawnType;
        spawnEnemy(currentSpawnType);
        spawnFrameCount = 0;
        currentEnemyIndex++;

        if (currentEnemyIndex == wave.length) {
            currentEnemyIndex = 0;

            // handleCutscenesAndStuff();

            isSpawningWave = false;
            currentWave++;
        }
    }
}

function handleCutscenesAndStuff() {

    // isSpawningWave = false;
    // currentWave++;
}

function spawnEnemy() {
    if (currentSpawnType == PLANE_PARADROPPER) {
        shipSpawn();
    } else if (currentSpawnType == PLANE_GUNNER) {
        gunnerSpawn();
    }
}