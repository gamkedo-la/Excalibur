LaserShotClass.reloadTime = 64;
//TODO add beamThickness and laserLife stuff from Chris' commits
function LaserShotClass(x, y, angle) {
	// ShotClass(x, y, angle, speed)
	ShotClass.call(this, x, y, angle, 0);
	
	this.width = 18;
	this.height = 1050;
	
	this.tickCount = 0;
	this.numFrames = 2;
	this.ticksPerFrame = 6;
	this.frames = 2;
	this.frameOffset = 0;
	
	this.duration = 5;
	this.thickLaserRatio = 1/2;
	
	this.sprite = new SpriteSheetClass(laserPic, this.width, this.height);
	
	this.colliderLineSegLaserLeft = new lineSegment();
//this.laserStartLife = this.laserLife = cannonReloadLeft * (5.4+playerUpgradeROF*10.8);  //??
	this.colliderLineSegLaserRight = new lineSegment();

	this.draw = function () {
		var frameNow = Math.floor(this.tickCount / this.ticksPerFrame) % this.frames + this.frameOffset;
		var flipSprite = Math.floor((this.tickCount + this.ticksPerFrame/2) / this.ticksPerFrame) % this.frames;
		
		this.sprite.draw(frameNow, 0,
		                 this.position.x + this.height/2 * Math.cos(this.moveAng),
		                 this.position.y + this.height/2 * Math.sin(this.moveAng),
		                 this.moveAng + Math.PI/2,
		                 flipSprite);
		
		// Swap to thin laser part way through shooting
		if (this.tickCount > this.duration * this.thickLaserRatio) {
			this.frameOffset = this.numFrames;
		}
	};

	this.move = function () {
		this.tickCount++;
		
		//this.laserLife--;//??
		//this.beamThickness = (1+playerUpgradeROF) * (this.laserStartLife/2-(Math.abs(this.laserLife-this.laserStartLife/2)))/20.0;//??
		
		this.moveAng = cannonAngle;
		this.position.x = cannonEndX;
		this.position.y = cannonEndY;
		
		if (this.tickCount >= this.duration) {
			this.removeMe = true;
		}
	};

	this.updateCollider = function () {
		var perpAng = this.moveAng + Math.PI / 2; //perpinducar Angle since we want to go left/right of where barrel is facing
		
		var lowerXOffset = (this.width/2) * Math.cos(perpAng);
		var lowerYOffset = (this.width/2) * Math.sin(perpAng);
		var lengthXOffset = this.height * Math.cos(this.moveAng);
		var lengthYOffset = this.height * Math.sin(this.moveAng);
		
		var laserLowerLeft = vec2.create(this.position.x - lowerXOffset, this.position.y - lowerYOffset);
		var laserLowerRight = vec2.create(this.position.x + lowerXOffset, this.position.y + lowerYOffset);
		var laserTopLeft = vec2.create(laserLowerLeft.x + lengthXOffset, laserLowerLeft.y + lengthYOffset);
		var laserTopRight = vec2.create(laserLowerRight.x + lengthXOffset, laserLowerRight.y + lengthYOffset);
		
		this.colliderLineSegLaserLeft.setEndPoints(laserLowerLeft,laserTopLeft);
		this.colliderLineSegLaserRight.setEndPoints(laserLowerRight,laserTopRight);
	};

	this.checkCollisions = function(list) {
		for (var i = 0; i < list.length; i++) {
			list[i].checkLineCollision(this.colliderLineSegLaserLeft, list[i].position);
			list[i].checkLineCollision(this.colliderLineSegLaserRight, list[i].position);
		}
	};
};
