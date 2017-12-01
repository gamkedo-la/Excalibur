// For reference - Terrence
//const PLANE_PARADROPPER = 1;
//const PLANE_GUNNER = 2;

var orchestratorMode = false;

var createNewWave = [];

var orchestratorCurrentSpawnType = 0;
var orchestratorSpawnFrameCount = 0;

var enemyData = { 
	spawnType: null, 
	framesUntilSpawn: null 
	}

function orchestratorFrameCount() {
	orchestratorSpawnFrameCount++;
}

function orchestratorSpawnEnemy() {
    if (orchestratorCurrentSpawnType == PLANE_PARADROPPER) {
        shipSpawn();
    } else if (orchestratorCurrentSpawnType == PLANE_GUNNER) {
        gunnerSpawn();
    }
    orchestratorCurrentSpawnType = 0;
    orchestratorSpawnFrameCount = 0;
}