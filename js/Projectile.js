var shotList = [];

function initializeShotClasses() {
	CannonShotClass.prototype = new ShotClass();
	CannonShotClass.prototype.constructor = CannonShotClass;
	WaveShotClass.prototype = new ShotClass();
	WaveShotClass.prototype.constructor = WaveShotClass;
	LaserShotClass.prototype = new ShotClass();
	LaserShotClass.prototype.constructor = LaserShotClass;
	
	EnemyShotClass.prototype = new ShotClass();
	EnemyShotClass.prototype.constructor = EnemyShotClass;
}

function ShotClass(x, y, angle, speed) {
	this.moveAng = angle;
	this.position = vec2.create(x, y);
	this.prevPosition = vec2.create(x, y);
	this.velocity = vec2.create(Math.cos(this.moveAng) * speed, Math.sin(this.moveAng) * speed);
	
	this.sprite;
	
	this.removeMe = false;
	
	this.move = function() {
		vec2.copy(this.prevPosition,this.position);
		vec2.add(this.position, this.position, this.velocity);
	};
	
	this.shotCollisionAndBoundaryCheck = function() {
		this.checkBounds();
		this.updateCollider();
		
		this.checkCollisions(shipList);
		this.checkCollisions(missileList);
		this.checkCollisions(alienList);
	};
	
	this.checkBounds = function() {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0) {
			this.removeMe = true;
		}
	};
	
	this.updateCollider = function() {
		this.colliderLineSeg.setEndPoints(this.prevPosition, this.position);
	}
	
	this.checkCollisions = function(list) {
		for (var i = 0; i < list.length; i++) {
			list[i].checkLineCollision(this.colliderLineSeg, this.position)
		}
	};
};

function drawAndRemoveShots() {
    var i = shotList.length;
    while (i--) {
        shotList[i].draw();
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
