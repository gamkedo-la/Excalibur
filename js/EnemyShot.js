function EnemyShotClass(x, y, angle, speed) {
	// ShotClass(x, y, angle, speed)
	ShotClass.call(this, x, y, angle, speed);

	this.width = 4;
	this.height = 4;
	
	this.fromEnemy = true;

	this.colliderLineSeg = new lineSegment();

	this.draw = function() {
		canvasContext.fillStyle = "red";
		canvasContext.fillRect(this.position.x - 1, this.position.y - 1, this.width, this.height);
	};

	this.checkBounds = function() {
		if (this.position.x < 0 || this.position.x > canvas.width || this.position.y > canvas.height) {
			this.removeMe = true;
		}
	};

	this.shotCollisionAndBoundaryCheck = function() {
		this.checkBounds();
		this.updateCollider();

		if (isColliding_AABB_LineSeg(playerColliderAABB, this.colliderLineSeg)) {
			this.removeMe = true;
			hitPlayer();
		}
	};
}
