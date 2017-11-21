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
        'updateFunction': updateShield,
        'radius': 60
    },
    'health': {
    	'image': healthPowerUpPic,
        'description': 'Restores one point of health to the player.',
        'updateFunction': restoreHealth
    },
    'maxHealth': {
    	'image': maxHealthPowerUpPic,
        'description': 'Restores all health to the player.',
        'updateFunction': restoreMaxHealth
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
        if (this.isActive && this.properties.hasOwnProperty('updateFunction')) {
            this.properties['updateFunction'](this);
        }
    }

    this.move = function() {
        this.position.y += dropSpeed;

        this.colliderAABB.setCenter(this.position.x, this.position.y);
        this.colliderAABB.computeBounds();
        this.checkForCollisionWithPlayer();

        if (this.position.y >= canvas.height && !this.isActive) {
            this.canDestroy = true;
        }
    }

    this.setActive = function(canUseMaxDuration) {
        if (this.isActive) return;
        this.isActive = true;
        activePowerUps.push(this);

        if (this.properties.hasOwnProperty('duration')) {
            this.activeDuration = this.properties.duration;
            if (canUseMaxDuration && this.properties.hasOwnProperty('maxDuration')) {
                this.activeDuration = this.properties.maxDuration;
            }
            this.activeDuration *= millisecond;
            var self = this;
            setTimeout(function() {
                self.isActive = false;
                self.canDestroy = true;
            }, this.activeDuration)
        }
    }

    this.checkForCollisionWithPlayer = function() {
        var isCollidingWithPlayer = this.position.x > (playerX - playerWidth) &&
            this.position.y > playerY &&
            this.position.x < (playerX + playerWidth) &&
            this.position.y < (playerY + playerHeight);

        if (isCollidingWithPlayer) {
            this.setActive();
        }
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
    if (spawnChance > 0 && timeDifference > secondsBetweenDrops) {
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
    this.powerUpTypes = powerUpTypes.slice();

    // filter out health power ups if the player has full health
    if (playerHP === startHitpoints) {
        this.powerUpTypes = [];
        for (var i = 0; i < powerUpTypes.length; i++) {
            if (powerUpTypes[i].toLowerCase().indexOf('health') < 0) {
                this.powerUpTypes.push(powerUpTypes[i]);
            }
        }
    }

    var min = 0;
    var max = this.powerUpTypes.length - 1;
    var randomIndex = Math.floor(Math.random() * (max - min + 1) + min);
    return this.powerUpTypes[randomIndex];
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

function updateShield(shield) {
    var enemyEntities = {
        shots: {
            list: shotList,
            width: shotWidth,
            height: shotHeight
        },
        aliens: {
            list: alienList,
            width: alienWidth,
            height: alienHeight
        }
    };

    drawShield();
    checkShieldCollisions();

    function drawShield() {
        canvasContext.fillStyle = 'rgba(52, 166, 253, 0.6)';
        canvasContext.beginPath();
        canvasContext.arc(playerX, playerY, shield.properties.radius, 0, Math.PI * 2, true);
        canvasContext.fill();
    }

    function checkShieldCollisions() {

        Object.keys(enemyEntities).forEach(function(enemyEntity) {
            var currentList = enemyEntities[enemyEntity].list;
            var currentEnemyWidth = enemyEntities[enemyEntity].width;
            var currentEnemyHeight = enemyEntities[enemyEntity].height;

            for (var i = 0; i < currentList.length; i++) {
                var currentEnemy = currentList[i];

                // ignore collisions with shots if they aren't from the enemy
                if (enemyEntity == 'shots' && !currentList[i].fromEnemy) continue;

                var distanceX = Math.abs(playerX - (currentEnemy.position.x - (currentEnemyWidth / 2)));
                var distanceY = Math.abs(playerY - (currentEnemy.position.y - (currentEnemyHeight / 2)));

                if (distanceX <= (currentEnemyWidth / 2) || distanceY <= (currentEnemyHeight / 2)) {
                    currentEnemy.removeMe = true;
                }

                // test for corner collisions
                distanceX -= currentEnemyWidth / 2;
                distanceY -= currentEnemyHeight / 2;
                var radiusSquared = shield.properties.radius * shield.properties.radius;
                if (distanceX * distanceX + distanceY * distanceY <= radiusSquared) {
                    currentEnemy.removeMe = true;
                }
            }
        });
    }
}

function restoreHealth(powerUp) {
	if(playerHP === startHitpoints) return;
	playerHP++;
	powerUp.isActive = false;
	powerUp.canDestroy = true;
}

function restoreMaxHealth(powerUp) {
	if(playerHP === startHitpoints) return;
	playerHP = startHitpoints;
	powerUp.isActive = false;
	powerUp.canDestroy = true;
}