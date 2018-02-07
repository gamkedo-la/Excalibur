function ProtectionShipClass() {
	//EnemyShipClass(width, height, speed, angle, health)
	this.height = 100;
	this.width = 42;
	this.speed = 1.5;
	this.angle = 0;
	this.health = 1;

	EnemyShipClass.call(this, this.height, this.width, this.speed, this.angle, this.health);
	
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
	this.collectorPosition = vec2.create(this.position.x, this.position.y + 16);
	this.colliderCollectorAABB = new aabb(this.collectorWidth / 2, this.collectorHeight / 2);
	this.collectorEnergy = 0;
	this.collectorCharged = 3;

	this.laser = null;

	this.parentDraw = this.draw;
	this.draw = function() {
		this.parentDraw();

		if (this.collectorEnergy >= this.collectorCharged && this.health > 0) {
			if (this.laser != null)
				this.laser.removeMe = true;
			this.laser = new EnemyLaserShotClass(this.collectorPosition.x - this.collectorWidth/4, 
				                                 this.collectorPosition.y + this.collectorHeight/6, 
				                                 0, this.speed, this.movingLeft);
			shotList.push(this.laser);
			// console.log("enemy laser fired!");
			this.collectorEnergy = 0;
		}

		if (this.health <= 0 && this.laser != null) {
			this.laser.removeMe = true;
			this.laser = null;
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