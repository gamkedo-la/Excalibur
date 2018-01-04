var missileList = [];
var missileFrameW = 31;
var missileFrameH = 10;
var frameNow = 0;
var delayInMilliseconds = 150;

var diceRoll;
var saveMissilePosition;

function missileClass() {
    var diceRoll = Math.random()*10;
    this.missileX = diceRoll < 5 ? 20 : canvas.width - 20;
    this.missileY = -60;
    this.position = vec2.create(this.missileX,this.missileY);
    this.speed = 5;
    this.moveAng = Math.atan2(playerY - this.missileY, playerX - this.missileX);
    this.missileSpeedY = this.missileSpeedX = this.speed;
    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    this.velocity.x *= this.missileSpeedX;
    this.velocity.y *= this.missileSpeedY;
    this.missileHealth = 3;
    this.colliderAABB = new aabb(missileFrameW / 2, missileFrameH / 2);
    this.removeMe = false;
    this.isDamaged = false;
    this.missileDestroyed = false;
    this.frameNow = 0;

    this.draw = function() {
        drawAnimatedHorizontalBitmapCenteredAtLocationWithRotation(missilePic, this.frameNow, 
                                                         missileFrameW, missileFrameH, 
                                                         this.position.x, this.position.y,
                                                         this.moveAng);
        if (masterFrameDelayTick % 10 == 0) {
                this.frameNow = 0;
            } else if (masterFrameDelayTick % 10 == 5) {
                this.frameNow = 1;
            }
    };

    this.move = function() {
        damageSmokeExplosion(this.position.x,this.position.y);
        vec2.add(this.position, this.position, this.velocity);
        this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with missile position
        this.colliderAABB.computeBounds();
    };

    this.edgeOfScreenDetection = function() {
        if (this.position.y + missileFrameH/2 > canvas.height) {
            saveMissilePosition = vec2.create(this.position.x,this.position.y);
            var newMissileExplosion = new missileExplosionClass();
            missileList.push(newMissileExplosion);
            this.position.x = this.position.y = FAR_AWAY; // FAR_AWAY from Explosions.js
            this.removeMe = true;
        }
        if (this.isDamaged) {
            this.missileHealth--;
            this.isDamaged = false;
        } 
        if (this.missileHealth == 0) {
            this.missileDestroyed = true;
            shipHitExplosion(this.position.x,this.position.y);
            this.removeMe = true;
        }
    };
};

function missileExplosionClass() {
    this.position = vec2.create(saveMissilePosition.x, saveMissilePosition.y);
    this.colliderAABB = new aabb(explosion_w / 2, explosion_h / 2);
/*  this.colliderAABB = new aabb(explosion_w / 2, explosion_h / 2);
    this.colliderAABB.setCenter(this.position.x, this.position.y);
    this.colliderAABB.computeBounds();  */
    var explosionScale = 3; // 3 because of scaling from missileExplosion() in Explosions.js 
    /*this.colliderLineSegMissileExplosionLeft = new lineSegment();
    this.colliderLineSegMissileExplosionRight = new lineSegment();*/
    this.missileExplosionLowerRight = vec2.create(this.position.x + (explosion_w/2) * explosionScale,
                            this.position.y + (explosion_h/2) * explosionScale);
    this.missileExplosionTopLeft = vec2.create(this.position.x - (explosion_w/2) * explosionScale,
                          this.position.y - (explosion_h * explosionScale));

    /*this.colliderLineSegMissileExplosionLeft.setEndPoints(missileLowerRight,missileTopRight);
    this.colliderLineSegMissileExplosionRight.setEndPoints(missileLowerLeft,missileTopLeft);*/
    this.removeMe = false;

    this.draw = function() {
        missileExplosion(this.position.x,this.position.y);
    };

    this.move = function() {
       if (!boundariesNotOverlapping(playerTopLeft, playerLowerRight,
                                     this.missileExplosionTopLeft,this.missileExplosionLowerRight)) {
            setTimeout(function() {
                hitPlayer();
            }, delayInMilliseconds);
       }
    };

    this.edgeOfScreenDetection = function() {
        if (!missileExplosion()) {
            this.removeMe = true;
        }
    };
};

function drawAndRemoveMissiles() {
    for(var i=0;i<missileList.length;i++) {
        missileList[i].draw();
        if (missileList[i].missileDestroyed) {
            if (canSpawnPowerUp()) {
                spawnPowerUp(missileList[i]);
            }
        }
    }
    for(var i=missileList.length-1;i>=0;i--) {
        if(missileList[i].removeMe) {
            missileList.splice(i,1);
        }
    }
};

function moveMissiles() {
    for(var i=0;i<missileList.length;i++) {
        missileList[i].move();
        missileList[i].edgeOfScreenDetection();
    }
};

function missileSpawn() {
    var newMissile = new missileClass();
    missileList.push(newMissile);
}