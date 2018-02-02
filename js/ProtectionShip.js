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
	this.collectorPosition = vec2.create(this.position.x, 
							 			 this.position.y + this.height);
	this.colliderCollectorAABB = new aabb(this.collectorWidth / 2, this.collectorHeight / 2);
	this.collectorEnergy = 0;
	
	this.parentMove = this.move;
	this.move = function(){
		this.incrementTick();
		this.parentMove();
		vec2.add(this.collectorPosition, this.collectorPosition, this.velocity);
		this.colliderCollectorAABB.setCenter(this.collectorPosition.x, this.collectorPosition.y); // Synchronize AABB position with ship position
		this.colliderCollectorAABB.computeBounds();
		canvasContext.save();
		canvasContext.translate(this.collectorPosition.x, this.collectorPosition.y);
		drawRect(-this.collectorWidth/2,-this.collectorHeight/2,this.collectorWidth,this.collectorHeight,"pink");
		canvasContext.restore();
	};

	this.parentCollision = this.checkLineCollision;
	this.checkLineCollision = function(lineSegment, projectilePos) {
		if(this.health <= 0 || this.removeMe) {
			return;
		}

		if(isColliding_AABB_LineSeg(this.colliderAABB, lineSegment)) {
			this.explosion(projectilePos.x, projectilePos.y);
			this.health--;
			score += this.score;
			shotsHit++;
			shotsHitShips++;
			
			if (canSpawnPowerUp()) {
				spawnPowerUp(this);
			}
			
			return true;
		}

		if(isColliding_AABB_LineSeg(this.colliderCollectorAABB, lineSegment)) {
			console.log("collector hit!");
			this.collectorEnergy++;
			return true;
		}
		return false;
	};
};

function protectionShipSpawn() {
	shipList.push(new ProtectionShipClass());
	shipsTotal++;
	dropShipsTotal++;
}