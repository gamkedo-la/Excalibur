function initializeEnemyClasses() {
	EnemyShipClass.prototype = new EnemyClass();
	EnemyShipClass.prototype.constructor = EnemyShipClass;
	MissileClass.prototype = new EnemyClass();
	MissileClass.prototype.constructor = MissileClass;
	
	GunshipClass.prototype = new EnemyShipClass();
	GunshipClass.prototype.constructor = GunshipClass;
	DropshipClass.prototype = new EnemyShipClass();
	DropshipClass.prototype.constructor = DropshipClass;
	ProtectionShipClass.prototype = new EnemyShipClass();
	ProtectionShipClass.prototype.constructor = ProtectionShipClass;
}

function EnemyClass(width, height, speed, angle, health) {
	this.width = width;
	this.height = height;
	this.ang = angle;
	this.velocity = vec2.create(Math.cos(this.ang) * speed, Math.sin(this.ang) * speed);
	this.colliderAABB = new aabb(width / 2, height / 2);
	
	this.score;
	
	this.health = health;
	this.removeMe = false;
	
	this.tickCount = 0;
	
	this.incrementTick = function() {
		this.tickCount++;
		
		if(this.tickCount >= this.numFrames * this.ticksPerFrame) {
			this.tickCount = 0;
		}
	};
	
	this.move = function() {
		vec2.add(this.position, this.position, this.velocity);
		this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with ship position
		this.colliderAABB.computeBounds();
		this.edgeOfScreenDetection();
	};
	
	this.edgeOfScreenDetection = function() {
		if ((this.position.x < -this.colliderAABB.width - this.colliderAABB.height) ||
		    (this.position.x > canvas.width + this.colliderAABB.width + this.colliderAABB.height) ||
		    (this.position.y > canvas.height + this.colliderAABB.width + this.colliderAABB.height)) {
			this.removeMe = true;
		}
	};
	
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
		return false;
	};
}
