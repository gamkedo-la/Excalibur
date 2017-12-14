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
            }
        }
        for (var t = 0; t < alienList.length; t++) {
            // TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)
            if (this.position.y > alienList[t].position.y - alienHeight && this.position.y < alienList[t].position.y &&
                this.position.x > alienList[t].position.x - alienWidth / 2 && this.position.x < alienList[t].position.x + alienWidth / 2) {

                alienHitExplosion(this.position.x,this.position.y);

                score += scoreForAlienShot;
                alienList[t].removeMe = true;
                this.removeMe = true;
            } else if (this.position.y > alienList[t].chuteY && this.position.y < alienList[t].chuteY + parachuteH &&
                this.position.x > alienList[t].chuteX && this.position.x < alienList[t].position.x + parachuteW && alienList[t].isChuteDrawn) {
                // TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)

                score += scoreForParachuteShot;
                alienList[t].isChuteDrawn = false;
            } // end of parachute collision check
        } // end of for alienList.length
    }; // end of shotCollisionAndBoundaryCheck function
} // end of shotClass

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
        // note: not checking screen top since we can't shoot up
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