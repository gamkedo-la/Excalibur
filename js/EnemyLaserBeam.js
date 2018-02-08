function EnemyLaserShotClass(x, y, angle, speed, direction, fromShip) {
	// ShotClass(x, y, angle, speed)
	ShotClass.call(this, x, y, angle, speed);
	this.movingLeft = direction;

	this.width = 50;
	this.height = 600;
	
	this.tickCount = 0;
	this.numFrames = 2;
	this.ticksPerFrame = 6;
	this.frames = 2;
	this.frameOffset = 0;
	this.duration = 60;
	this.thickLaserRatio = 1/2;
	
	//this.sprite = new SpriteSheetClass(laserPic, this.width, this.height);
	
	this.colliderLineSegLaserLeft = new lineSegment();
	this.colliderLineSegLaserRight = new lineSegment();

	this.draw = function () {
		drawRect(this.position.x, this.position.y, this.width, this.height, "yellow");
		// var frameNow = Math.floor(this.tickCount / this.ticksPerFrame) % this.frames + this.frameOffset;
		// var flipSprite = Math.floor((this.tickCount + this.ticksPerFrame/2) / this.ticksPerFrame) % this.frames;
		
		// this.sprite.draw(frameNow, 0,
		//                  this.position.x + this.height/2 * Math.cos(this.moveAng),
		//                  this.position.y + this.height/2 * Math.sin(this.moveAng),
		//                  this.moveAng + Math.PI/2,
		//                  flipSprite);
		
		// // Swap to thin laser part way through shooting
		// if (this.tickCount > this.duration * this.thickLaserRatio) {
		// 	this.frameOffset = this.numFrames;
		// }
	};

	this.move = function () {
		this.tickCount++;
		var speedDirection = this.movingLeft ? -speed : speed;
		this.position.x += speedDirection;
		
		if (this.tickCount >= this.duration) {
			this.removeMe = true;
			this.tickCount = 0;
			fromShip.frameRow = fromShip.spriteRows.flying;
			fromShip.collectorFiring = false;
		}
	};

	this.checkBounds = function() {
		if (this.position.x < 0 || this.position.x > canvas.width || this.position.y > canvas.height) {
			this.removeMe = false;
		}
	};

	this.updateCollider = function () {
		var laserTopLeft = vec2.create(this.position.x, this.position.y);
		var laserTopRight = vec2.create(laserTopLeft.x + this.width, laserTopLeft.y);
		var laserLowerLeft = vec2.create(laserTopLeft.x, laserTopLeft.y + this.height);
		var laserLowerRight = vec2.create(laserTopRight.x, laserLowerLeft.y);
		
		this.colliderLineSegLaserLeft.setEndPoints(laserLowerLeft,laserTopLeft);
		this.colliderLineSegLaserRight.setEndPoints(laserLowerRight,laserTopRight);
	};

	this.shotCollisionAndBoundaryCheck = function() {
		this.checkBounds();
		this.updateCollider();

		if (isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSegLaserLeft) ||
			isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSegLaserRight)) {
			this.removeMe = false;
			hitPlayer();
		}
	};
};
