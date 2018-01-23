const shotWidth = 4;
const shotHeight = 4;
var shotList = [];

var shotsFired = 0;


function shotClass(x, y, angle, speed) {
    this.width = shotWidth;
    this.height = shotHeight;
    this.position = vec2.create(x, y);
    this.moveAng = angle;
    this.speed = speed;

    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    vec2.scale(this.velocity, this.velocity, this.speed);

    this.colliderLineSeg = new lineSegment();

    this.removeMe = false;

    this.draw = function() {
        drawBitmapCenteredAtLocationWithRotation(shotPic, this.position.x, this.position.y, this.moveAng + Math.PI/2);
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

        /* // no longer allowing collection of powerups by shots, happened very often by accident, hard to tell cause/effect :)
        powerUpBoxList.forEach(function(powerUpBox) {
            if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSeg)) {

                powerupExplosion(this.position.x,this.position.y);
                shieldPowerUpSound.play();
                
                var useMaxDuration = true;
                score += scoreForPowerUpShot;
                powerUpBox.setActive(useMaxDuration);
                this.removeMe = true;
            }
        }, this);*/

        this.checkCollisions(shipList);
        this.checkCollisions(missileList);
        this.checkCollisions(alienList);
    }; // end of shotCollisionAndBoundaryCheck function
    
    this.checkCollisions = function(list) {
        for (var i = 0; i < list.length; i++) {
            if(list[i].checkLineCollision(this.colliderLineSeg, this.position)){
                this.removeMe = true;
            }
        }
    };
}; // end of shotClass

function EnemyShotClass(x, y, angle, speed) {
    this.width = shotWidth;
    this.height = shotHeight;
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