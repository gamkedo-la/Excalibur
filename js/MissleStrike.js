var missleList = [];
var missleFrameW = 31;
var missleFrameH = 10;
var frameNow = 0;

var diceRoll;
var saveMisslePosition;

function missleClass() {
    var diceRoll = Math.random()*10;
    this.missleX = diceRoll < 5 ? 20 : canvas.width - 20;
    this.missleY = -60;
    this.position = vec2.create(this.missleX,this.missleY);
    this.speed = 5;
    this.moveAng = Math.atan2(playerY - this.missleY, playerX - this.missleX);
    this.missleSpeedY = this.missleSpeedX = this.speed;
    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    this.velocity.x *= this.missleSpeedX;
    this.velocity.y *= this.missleSpeedY;
    this.missleHealth = 3;
    this.colliderAABB = new aabb(missleFrameW / 2, missleFrameH / 2);
    this.removeMe = false;
    this.isDamaged = false;
    this.frameNow = 0;

    this.draw = function() {
        drawAnimatedHorizontalBitmapCenteredAtLocationWithRotation(misslePic, this.frameNow, 
                                                         missleFrameW, missleFrameH, 
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
        this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with missle position
        this.colliderAABB.computeBounds();
    };

    this.edgeOfScreenDetection = function() {
        if (this.position.y + missleFrameH/2 > canvas.height) {
            saveMisslePosition = vec2.create(this.position.x,this.position.y);
            var newMissleExplosion = new missleExplosionClass();
            missleList.push(newMissleExplosion);
            this.position.x = this.position.y = FAR_AWAY; // FAR_AWAY from Explosions.js
        }
        if (this.isDamaged) {
            this.missleHealth--;
            this.isDamaged = false;
        } 
        if (this.missleHealth == 0) {
            shipHitExplosion(this.position.x,this.position.y);
            this.removeMe = true;
        }
    };
};

function missleExplosionClass() {
    this.position = vec2.create(saveMisslePosition.x, saveMisslePosition.y);
/*  this.colliderAABB = new aabb(explosion_w / 2, explosion_h / 2);
    this.colliderAABB.setCenter(this.position.x, this.position.y);
    this.colliderAABB.computeBounds();  */
    var explosionScale = 3; // 3 because of scaling from missleExplosion() in Explosions.js 
    this.colliderLineSegMissleExplosionLeft = new lineSegment();
    this.colliderLineSegMissleExplosionRight = new lineSegment();
    lowerRight = vec2.create(this.position.x + (explosion_w/2) * explosionScale,
                            this.position.y + (explosion_h/2) * explosionScale);
    lowerLeft = vec2.create(this.position.x - (explosion_w/2) * explosionScale,
                            this.position.y + (explosion_h/2) * explosionScale);
    topRight = vec2.create(lowerRight.x,
                           lowerRight.y - (explosion_h * explosionScale));
    topLeft = vec2.create(lowerLeft.x,
                          lowerLeft.y - (explosion_h * explosionScale));

    this.colliderLineSegMissleExplosionLeft.setEndPoints(lowerRight,topRight);
    this.colliderLineSegMissleExplosionRight.setEndPoints(lowerLeft,topLeft);
    this.removeMe = false;

    this.draw = function() {
        missleExplosion(this.position.x,this.position.y);
    };

    this.move = function() {
       if (isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSegMissleExplosionLeft)
           || isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSegMissleExplosionRight)) {
            hitPlayer();
       }
    };

    this.edgeOfScreenDetection = function() {
        if (!missleExplosion) {
            this.removeMe = true;
            missleClass.removeMe = true;
        }
    };
};

function drawAndRemoveMissles() {
    for(var i=0;i<missleList.length;i++) {
        missleList[i].draw();
    }
    for(var i=missleList.length-1;i>=0;i--) {
        if(missleList[i].removeMe) {
            missleList.splice(i,1);
        }
    }
};

function moveMissles() {
    for(var i=0;i<missleList.length;i++) {
        missleList[i].move();
        missleList[i].edgeOfScreenDetection();
    }
};

function missleSpawn() {
    var newMissle = new missleClass();
    missleList.push(newMissle);
}