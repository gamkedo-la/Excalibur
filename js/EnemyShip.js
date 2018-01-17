const shipGravity = vec2.create(0, 0.04);
const shipSpawnBandThickness = 200;
const shipSpawnBandMargin = 50;
var shipList=[];

function EnemyShipClass(width, height, speed, angle, health) {
	//EnemyClass(width, height, speed, angle, health)
	EnemyClass.call(this, width, height, speed, angle, health);
	
	this.score = 100;
	
	this.movingLeft = Math.random() < 0.5;
	this.position = vec2.create(
		this.movingLeft ? canvas.width + this.width / 2 : -this.width / 2,
		Math.random() * shipSpawnBandThickness + shipSpawnBandMargin
	);

	if(this.movingLeft){
		vec2.scale(this.velocity, this.velocity, -1);
	}
	
	this.hasDroppedYet = false;
	this.dropX = getValidDropX(canvas.width);
	
	var deathRotation = Math.random() > 0.5 ? 0.02 : -0.02;
	var deathVelocity = this.movingLeft ? -2.6 : 2.6;
	this.explosion = shipHitExplosion;
	
	this.draw = function () {
		if (this.health <= 0) {
			this.frameRow = this.spriteRows.damaged;
			
			this.ang += deathRotation;
			this.velocity.x = deathVelocity;
			
			vec2.add(this.velocity, this.velocity, shipGravity);
			vec2.add(this.position, this.position, this.velocity);
			
			damageSmokeExplosion(this.position.x,this.position.y);
		}
		
		this.sprite.draw(Math.floor(this.tickCount / this.ticksPerFrame), this.frameRow, this.position.x, this.position.y, this.ang, this.movingLeft);
	};
	
	this.canDeploy = function () {
		if (this.health <= 0 || this.removeMe || this.hasDroppedYet) {
			return false;
		}
		
		// crossing drop line
		return ((this.movingLeft && this.position.x < this.dropX) ||
		        (!this.movingLeft && this.position.x > this.dropX));
	};
}

function getValidDropX(maxWidth) {
	return Math.random() * (maxWidth - dropMarginFromEdge * 2) + dropMarginFromEdge;
}

function drawAndRemoveShips() {
	for(var i=0;i<shipList.length;i++) {
		shipList[i].draw();
	}
	for(var i=shipList.length-1;i>=0;i--) {
		if(shipList[i].removeMe) {
			shipList.splice(i,1);
		}
	}
}

function moveShips() {
	for(var i=0;i<shipList.length;i++) {
		shipList[i].move();
	}
}
