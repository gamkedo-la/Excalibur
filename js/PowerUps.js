const powerUpWidth = 30;
const powerUpHeight = 30;
const dropSpeed = 3;
const millisecond = 1000;
const secondsBetweenDrops = 4 * millisecond;
const scoreForPowerUpShot = 25;

const powerUps = {
    'shield': {
        'duration': 4,
        'maxDuration': 8,
        'image': shieldPowerUpPic,
        'description': 'Temporarily forms a protective shield around the player.',
        'drawFunction': drawShield
    }
};
const powerUpTypes = Object.keys(powerUps);

var lastPowerUpDroppedAt = 0;
var powerUpBoxList = [];
var activePowerUps = [];

function powerUp(fromShip) {
    this.type;
    this.properties;
    this.activeDuration;
    this.position = vec2.create(fromShip.position.v[0], fromShip.position.v[1] + shipHeight);
    this.canDestroy = false;
    this.isActive = false;
    this.colliderAABB = new aabb(powerUpWidth, powerUpHeight);

    this.draw = function() {

        // it's not been destroyed and it's not been picked up yet
        if (!this.isActive && !this.canDestroy && this.properties) {
            canvasContext.drawImage(
                this.properties.image,
                this.position.x - powerUpWidth / 2,
                this.position.y - powerUpHeight / 2,
                powerUpWidth,
                powerUpHeight
            );
        }

        // The power up has been picked up, so draw any affects if it has any
        if (this.isActive && this.properties.drawFunction) {
            this.properties['drawFunction']();
        }
    }

    this.move = function() {
        this.position.y += dropSpeed;

	    this.colliderAABB.setCenter(this.position.x, this.position.y);
	    this.colliderAABB.computeBounds();

        if (this.position.y >= canvas.height && !this.isActive) {
            this.canDestroy = true;
        }
    }

    this.setActive = function(canUseMaxDuration) {
        if (this.isActive) return;
        this.isActive = true;
        activePowerUps.push(this);
        this.activeDuration = this.properties.duration;
        if (canUseMaxDuration) {
            this.activeDuration = this.properties.maxDuration;
        }

        this.activeDuration *= millisecond;

        console.log('activeDuration', this.activeDuration);

        var self = this;
        setTimeout(function() {
            self.isActive = false;
            self.canDestroy = true;
        }, this.activeDuration)
    }
}

function resetPowerUps() {
    lastPowerUpDroppedAt = 0;
    powerUpBoxList = [];
    activePowerUps = [];
}

function canSpawnPowerUp() {
    var now = new Date().getTime();
    var timeDifference = now - lastPowerUpDroppedAt;
    var spawnChance = Math.round(Math.random());
    if (spawnChance > 0 && timeDifference >= secondsBetweenDrops) {
        lastPowerUpDroppedAt = now;
        return true;
    }
    return false;
}

function spawnPowerUp(fromShip) {
    var newPowerUp = new powerUp(fromShip);
    newPowerUp.type = getRandomPowerUpType();
    newPowerUp.properties = powerUps[newPowerUp.type];
    powerUpBoxList.push(newPowerUp);
}

function getRandomPowerUpType() {
    var min = 0;
    var max = powerUpTypes.length - 1;
    var randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
    return powerUpTypes[randomIndex];
}

function drawAndRemovePowerUps() {
    // power up boxes
    for (var i = 0; i < powerUpBoxList.length; i++) {
        powerUpBoxList[i].draw();
    }
    // remove the power up box if it goes off screen or if the player activates the power up
    for (var i = powerUpBoxList.length - 1; i >= 0; i--) {
        if (powerUpBoxList[i].canDestroy || powerUpBoxList[i].isActive) {
            powerUpBoxList.splice(i, 1);
        }
    }

    // active power ups
    for (var i = 0; i < activePowerUps.length; i++) {
        activePowerUps[i].draw();
    }
    for (var i = activePowerUps.length - 1; i >= 0; i--) {
        if (activePowerUps[i].canDestroy) {
            activePowerUps.splice(i, 1);
        }
    }
}

function movePowerUps() {
    for (var i = 0; i < powerUpBoxList.length; i++) {
        powerUpBoxList[i].move();
    }
}

function drawShield() {
    canvasContext.fillStyle = 'rgba(52, 166, 253, 0.6)';
    canvasContext.beginPath();
    canvasContext.arc(playerX, playerY, playerWidth + 2, 0, Math.PI * 2, true);
    canvasContext.fill();
}