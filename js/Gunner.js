function GunnerClass() {
    var gunnerWidth = 75;
    var gunnerHeight = 24;
    var gunnerCannonOffsetX = -5.5;
    var gunnerCannonOffsetY = gunnerHeight / 2;

    this.position = vec2.create(-gunnerWidth / 2, Math.random() * shipSpawnBandThickness + shipSpawnBandMargin);
    this.shipSpeed = 4;
    this.velocity = vec2.create(this.shipSpeed, 0);
    this.colliderAABB = new aabb(gunnerWidth / 2, gunnerHeight / 2);
    this.removeMe = false;
    this.hasDroppedYet = false;
    this.isShooting = false;
    this.dropX = getValidDropX(canvas.width / 2);
    this.isDamaged = false;
    this.ang = 0;
    var deathRotation = Math.random() > 0.5 ? 1 : -1;

    var gravity = vec2.create(0, 0.04);
    var frameNow = 0;
    var frameRow = 0;
    var numFrames = 6;
    var ticksPerFrame = 10;
    var frameOffsetY = 0;

    if (Math.random() < 0.5) {
        this.position.x = -shipWidth / 2;
        this.velocity.x = 4;
    } else {
        this.position.x = canvas.width + shipWidth / 2;
        this.velocity.x = -4;
        this.dropX += canvas.width / 2;
    }
    this.position.y = Math.random() * shipSpawnBandThickness + shipSpawnBandMargin;
    this.velocity.y = 0;

    var velocityX = this.velocity.x;
    var movingLeft = this.velocity.x < 0;
    var movingRight = this.velocity.x > 0;

    var sprite = new SpriteSheetClass(gunnerShipPic, 75, 24);

    this.draw = function() {
        if (masterFrameDelayTick % ticksPerFrame === 1) {
            frameNow++;
            
            if(frameNow >= numFrames) {
                frameNow = 0;
            }
        }

        if (this.isDamaged) {
            frameOffsetY = gunnerHeight * 2;
            
            frameRow = 3;
            frameNow = 0;
            this.ang += deathRotation * 0.03;
            this.velocity.x = (movingLeft ? -1: 1) * 2.8;

            vec2.add(this.velocity, this.velocity, gravity);
            vec2.add(this.position, this.position, this.velocity);

            damageSmokeExplosion(this.position.x,this.position.y);
        }
        sprite.draw(frameNow, frameRow, this.position.x, this.position.y, this.ang, movingLeft);
    };

    this.move = function() {
        vec2.add(this.position, this.position, this.velocity);
        this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with ship position
        this.colliderAABB.computeBounds();

        if (this.isShooting && frameNow >= numFrames - 1) {
            this.isShooting = false;
            this.velocity.x = velocityX;
            frameRow = 2;
            
            this.shoot();
        }
    };
    
    this.shoot = function() {
        // shoot bullet back
        var shotX = this.position.x + gunnerCannonOffsetX;
        var shotY = this.position.y + gunnerCannonOffsetY;
        var angle = Math.atan2(playerY - shotY, playerX - shotX);
        var newShot = new EnemyShotClass(shotX, shotY, angle, gunnerShotSpeed);
        shotList.push(newShot);
    }

    this.edgeOfScreenDetection = function() {
        var movingLeft = this.velocity.x < 0;
        var movingRight = this.velocity.x > 0;
        if ((movingLeft && this.position.x < -this.colliderAABB.width / 2) ||
            (movingRight && this.position.x > canvas.width + this.colliderAABB.width / 2)) {
            this.removeMe = true;
        }
    };

    this.spawnAliensFromShip = function() {
        if (this.hasDroppedYet) {
            return;
        }

        if ((movingLeft && this.position.x < this.dropX) ||
            (movingRight && this.position.x > this.dropX)) {
            this.hasDroppedYet = true;
            this.velocity.x = 0;
            this.isShooting = true;
            frameNow = 0;
            frameRow = 1;
            frameOffsetY = gunnerHeight;
        } // crossing drop line
    }
}

function gunnerSpawn() {
    var newShip = new GunnerClass();
    shipList.push(newShip);
}
