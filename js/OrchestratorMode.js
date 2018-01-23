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
    frameCount++;
    timeElapsedInSeconds = (new Date().getTime() - timeStarted) / 1000;
}

function orchestratorSpawnEnemy() {
    if (orchestratorCurrentSpawnType == PLANE_PARADROPPER) {
        dropshipSpawn();
    } else if (orchestratorCurrentSpawnType == PLANE_GUNSHIP) {
        gunshipSpawn();
    } else if (orchestratorCurrentSpawnType == MISSILE_STRIKE) {
        missileSpawn();
    }
    orchestratorCurrentSpawnType = 0;
    orchestratorSpawnFrameCount = 0;
}

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Unable to copy');
  }

  document.body.removeChild(textArea);
};