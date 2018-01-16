function GunshipClass() {
	//EnemyShipClass(width, height, speed, angle, health)
	EnemyShipClass.call(this, 75, 24, 4, 0, 1);
	
	this.cannonOffsetX = -5.5;
	this.cannonOffsetY = this.height / 2;
	this.shotSpeed = 5;
	this.isShooting = false;
	
	this.sprite = new SpriteSheetClass(gunshipPic, this.width, this.height);
	this.spriteRows = {
		flying: 0,
		dropping: 1,
		flyingAfterDrop: 2,
		damaged: 3,
	};
	this.numFrames = 6;
	this.ticksPerFrame = 10;
	this.frameRow = this.spriteRows.flying;
	
	this.parentDraw = this.draw;
	this.draw = function() {
		if (this.health <= 0) {
			this.tickCount = 0;
		}
		this.parentDraw();
	};
	
	this.parentMove = this.move;
	this.move = function() {
		this.incrementTick();
		if(this.isShooting){
			this.edgeOfScreenDetection();
		} else {
			this.parentMove();
		}
		this.checkFire();

		if (this.isShooting && this.tickCount === 0) {
			this.shoot();
			this.isShooting = false;
			this.frameRow = this.spriteRows.flyingAfterDrop;
		}
	};
	
	this.shoot = function() {
		// shoot bullet back
		var shotX = this.position.x + this.cannonOffsetX;
		var shotY = this.position.y + this.cannonOffsetY;
		var angle = Math.atan2(playerY - shotY, playerX - shotX);
		var newShot = new EnemyShotClass(shotX, shotY, angle, this.shotSpeed);
		shotList.push(newShot);
	};
	
	this.checkFire = function() {
		if(this.canDeploy()){
			this.hasDroppedYet = true;
			this.isShooting = true;
			this.tickCount = 1;
			this.frameRow = this.spriteRows.dropping;
		}
	};
}

function gunshipSpawn() {
	shipList.push(new GunshipClass());
}
