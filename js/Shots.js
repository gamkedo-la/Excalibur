const shotWidth = 4;
const shotHeight = 4;
var shotList = [];

function shotClass(x, y, angle, speed) {
    this.position = vec2.create(x, y);
    this.moveAng = angle;
    this.speed = speed;

    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    vec2.scale(this.velocity, this.velocity, this.speed);

    this.colliderLineSeg = new lineSegment();

    this.removeMe = false;

    this.draw = function() {
        drawBitmapCenteredAtLocationWithRotation(shotPic, this.position.x, this.position.y, Math.cos(this.moveAng));
    };

    this.move = function() {
        vec2.add(this.position, this.position, this.velocity);
    };

    this.shotCollisionAndBoundaryCheck = function() {
        // note: not checking screen bottom since we can't shoot down
        if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0) {
            this.removeMe = true;
        }

        // Compute the shot's previous position
        var prevPos = vec2.create();
        vec2.sub(prevPos, this.position, this.velocity);

        // Create line segment collider from current & previous positions
        this.colliderLineSeg.setEndPoints(prevPos, this.position);

        powerUpBoxList.forEach(function(powerUpBox) {
            if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSeg)) {

                powerupExplosion(this.position.x,this.position.y);
                shieldPowerUpSound.play();
                
                var useMaxDuration = true;
                score += scoreForPowerUpShot;
                powerUpBox.setActive(useMaxDuration);
                this.removeMe = true;
            }
        }, this);

        for (var e = 0; e < shipList.length; e++) {
            if (isColliding_AABB_LineSeg(shipList[e].colliderAABB, this.colliderLineSeg) && !shipList[e].isDamaged) {

                shipHitExplosion(this.position.x,this.position.y);

                if(!shipList[e].isDamaged){
                    score += scoreForShipShot;
                    shipList[e].isDamaged = true;
                }

                if (canSpawnPowerUp()) {
                    spawnPowerUp(shipList[e]);
                }

                this.removeMe = true;
            } // end of ship collision check
        } // end of for shipList.length
        for (var m = 0; m < missileList.length; m++) {
            if (!this.missileDestroyed) {
                if (isColliding_AABB_LineSeg(missileList[m].colliderAABB, this.colliderLineSeg) && !missileList[m].isDamaged) {

                    alienHitExplosion(this.position.x,this.position.y);

                    if(!missileList[m].isDamaged){
                        score += scoreForMissileShot;
                        missileList[m].isDamaged = true;
                    }

                    if (this.missileDestroyed) {
                        if (canSpawnPowerUp()) {
                            spawnPowerUp(missileList[m]);
                        }
                        missileList[m].removeMe = true;
                    }

                    this.removeMe = true;
                } // end of missile collision check
            } // end of this.missileDestroyed == false;
        } // end of for missileList.length
        for (var t = 0; t < alienList.length; t++) {
            if (isColliding_AABB_LineSeg(alienList[t].colliderAlienAABB, this.colliderLineSeg)) {
                alienHitExplosion(this.position.x,this.position.y);
                score += scoreForAlienShot;
                alienList[t].removeMe = true;
                this.removeMe = true;
            }
            if (alienList[t].isChuteDrawn) {
                if (isColliding_AABB_LineSeg(alienList[t].colliderChuteAABB, this.colliderLineSeg)) {
                    score += scoreForParachuteShot;
                    alienList[t].isChuteDrawn = false;
                } // end of parachute collision check
            } // end of if isChuteDrawn == true
        } // end of for alienList.length
    }; // end of shotCollisionAndBoundaryCheck function
}; // end of shotClass

function EnemyShotClass(x, y, angle, speed) {
    this.position = vec2.create(x, y);

    this.moveAng = angle;
    this.speed = speed;
    this.fromEnemy = true;

    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    vec2.scale(this.velocity, this.velocity, this.speed);

    this.colliderLineSeg = new lineSegment();

    this.removeMe = false;

    this.draw = function() {
        canvasContext.fillStyle = "red";
        canvasContext.fillRect(this.position.x - 1, this.position.y - 1, shotWidth, shotHeight);
    };

    this.move = function() {
        vec2.add(this.position, this.position, this.velocity);
    };

    this.shotCollisionAndBoundaryCheck = function() {
        if (this.position.x < 0 || this.position.x > canvas.width || this.position.y > canvas.height) {
            this.removeMe = true;
        }
        // Compute the shot's previous position
        var prevPos = vec2.create();
        vec2.sub(prevPos, this.position, this.velocity);

        // Create line segment collider from current & previous positions
        this.colliderLineSeg.setEndPoints(prevPos, this.position);
        if (isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSeg)) {
            this.removeMe = true;
            hitPlayer();
        }
    };

} // end of EnemyShotClass

function drawAndRemoveShots() {
    var i;
    for (i = 0; i < shotList.length; i++) {
        shotList[i].draw();
    }
    for (i = shotList.length - 1; i >= 0; i--) {
        if (shotList[i].removeMe) {
            shotList.splice(i, 1);
        }
    }
}

function moveShots() {
    for (var i = 0; i < shotList.length; i++) {
        shotList[i].move();
        shotList[i].shotCollisionAndBoundaryCheck();
    }
}

// Saved incase AABB collision needs to be replaced - Terrence

/*if (this.position.y > alienList[t].position.y - alienHeight && this.position.y < alienList[t].position.y &&
                this.position.x > alienList[t].position.x - alienWidth / 2 && this.position.x < alienList[t].position.x + alienWidth / 2) {

                alienHitExplosion(this.position.x,this.position.y);

                score += scoreForAlienShot;
                alienList[t].removeMe = true;
                this.removeMe = true;
            } else if (this.position.y > alienList[t].chuteY && this.position.y < alienList[t].chuteY + parachuteH &&
                this.position.x > alienList[t].chuteX && this.position.x < alienList[t].position.x + parachuteW && alienList[t].isChuteDrawn) {
                score += scoreForParachuteShot;
                alienList[t].isChuteDrawn = false;
            }*/