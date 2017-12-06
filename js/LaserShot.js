var usingTimedWeapon = false;

function laserShotClass(x, y, angle, speed) {
	const SET_PERP_LENGTH = 100;
	this.position = vec2.create(x, y);
	this.moveAng = angle;
	this.speed = speed;
	this.removeMe = false;
	this.startX = this.position.x = cannonEndX;
	this.startY = this.position.y = cannonEndY;
	var dx = dy = laserAngle = null;
	this.findBoundsSpeed= canvas.height + 100;
	this.frameNow = 0;
	laserColliderAABB = new aabb(laserPicFrameW/2, laserPicFrameH/2);
	laserColliderAABB.computeBounds();
	//this.colliderLineSeg = new lineSegment();

	this.draw = function () {
		if (this.position.x > canvas.width || this.position.x < 0 || this.position.y < 0){
			canvasContext.save();
			canvasContext.translate(this.startX,this.startY);
			canvasContext.rotate(laserAngle);
			canvasContext.drawImage(laserPic,
			this.frameNow * laserPicFrameW, 0,
			laserPicFrameW, laserPicFrameH,
			this.position.x - laserPicFrameW/2,
			this.position.y - laserPicFrameH/2,
			laserPicFrameW, laserPicFrameH);
			canvasContext.restore();
		}
	};

	this.move = function () {
		this.position.x += this.findBoundsSpeed * Math.cos(this.moveAng);
		this.position.y += this.findBoundsSpeed * Math.sin(this.moveAng);
		if (this.position.x > canvas.width || this.position.x < 0 || this.position.y < 0) {
			this.findBoundsSpeed = 0;
			dx = this.startX - this.position.x;
			dy = this.startY - this.position.y;
			laserAngle = Math.atan2(dy,dx);
		}
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down

		if (weaponFrameCount >= 54) {
			this.removeMe = true;
			usingTimedWeapon = false;
			weaponFrameCount = 0;
			this.laserFired = false;
		}
		
		/*// Compute the shot's previous position
		var prevPos = vec2.create();
        vec2.sub(prevPos, this.position, this.velocity);

        // Create line segment collider from current & previous positions
        this.colliderLineSeg.setEndpoints(prevPos, this.position);

        powerUpBoxList.forEach(function(powerUpBox) {
            if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSeg)) {
                var useMaxDuration = true;
                score += scoreForPowerUpShot;
                powerUpBox.setActive(useMaxDuration);
                this.removeMe = false;
            }
        }, this);*/

		for (var e = 0; e < shipList.length; e++) {
			if (this.position.y > shipList[e].position.y - shipHeight / 2 && this.position.y < shipList[e].position.y + shipHeight / 2 &&
				this.position.x > shipList[e].position.x - shipWidth / 2 && this.position.x < shipList[e].position.x + shipWidth / 2 &&
				!shipList[e].isDamaged) {
			   	
			   	shipList[e].isDamaged = true;
				score += scoreForShipShot;
				
				if (canSpawnPowerUp()) {
                   	spawnPowerUp(shipList[e]);
                }

				this.removeMe = false;
			}
		}
		for (var t = 0; t < alienList.length; t++) {
			if (this.position.y > alienList[t].position.y - alienHeight && this.position.y < alienList[t].position.y &&
				this.position.x > alienList[t].position.x - alienWidth / 2 && this.position.x < alienList[t].position.x + alienWidth / 2) {
			   
				score += scoreForAlienShot;
				alienList[t].removeMe = true;
				this.removeMe = false;
			} else if (this.position.y > alienList[t].chuteY && this.position.y < alienList[t].chuteY + parachuteH &&
				this.position.x > alienList[t].chuteX && this.position.x < alienList[t].position.x + parachuteW && alienList[t].isChuteDrawn) {
				// TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)
			   	
				score += scoreForParachuteShot;
				alienList[t].isChuteDrawn = false;
			} // end of parachute collision check
		} // end of alien collision check
	}; // end of shotCollisionAndBoundaryCheck function
}// end of laserShotClass