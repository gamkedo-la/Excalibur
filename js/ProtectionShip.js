function ProtectionShipClass() {
	//EnemyShipClass(width, height, speed, angle, health)
	EnemyShipClass.call(this, 100, 16, 1, 0, 1);
	
	this.sprite = new SpriteSheetClass(protectionShipPic, this.width, this.height);
	this.spriteRows = {
		flying: 0,
		damaged: 1,
	};
	this.frameRow = this.spriteRows.flying;
	this.numFrames = 2;
	this.ticksPerFrame = 40;

	this.collectorWidth = this.width;
	this.collectorHeight = 26;
	this.collectorPosition = vec2.create(this.position.x, this.position.y + this.height);
	this.colliderCollectorAABB = new aabb(this.collectorWidth / 2, this.collectorHeight / 2);
	this.collectorEnergy = 0;
	this.collectorCharged = 3;

	this.parentDraw = this.draw;
	this.draw = function() {
		if (this.health > 0) {
			canvasContext.save();
			canvasContext.translate(this.collectorPosition.x, this.collectorPosition.y);
			drawRect(-this.collectorWidth/2,-this.collectorHeight/2,this.collectorWidth,this.collectorHeight,"pink");
			canvasContext.restore();
		}

		this.parentDraw();

		if (this.collectorEnergy >= this.collectorCharged && this.health > 0) {
			var newShot = new EnemyLaserShotClass(this.collectorPosition.x - this.collectorWidth/4, 
				                                  this.collectorPosition.y + this.collectorHeight/2, 
				                                  0, 1, this.movingLeft);
			shotList.push(newShot);
			// console.log("enemy laser fired!");
			this.collectorEnergy = 0;
		}
	};

	this.parentMove = this.move;
	this.move = function() {
		this.incrementTick();
		this.parentMove();
		if (this.health > 0) {
		vec2.add(this.collectorPosition, this.collectorPosition, this.velocity);
		this.colliderCollectorAABB.setCenter(this.collectorPosition.x, this.collectorPosition.y); // Synchronize AABB position with ship position
		this.colliderCollectorAABB.computeBounds();
		}
	};

	this.parentCollision = this.checkLineCollision;
	this.checkLineCollision = function(lineSegment, projectilePos) {
		if(isColliding_AABB_LineSeg(this.colliderCollectorAABB, lineSegment) 
		   && this.health > 0) {
			this.collectorEnergy++;
			return true;
		}
		return this.parentCollision(lineSegment, projectilePos);
	};
};

function protectionShipSpawn() {
	shipList.push(new ProtectionShipClass());
	shipsTotal++;
	dropShipsTotal++;
}