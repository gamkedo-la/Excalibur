var usingTimedWeapon = false;

function laserShotClass(x, y, angle, speed) {
	this.speed = speed;
	this.position = vec2.create(x, y);
	// this.moveAng is angle + 90 deg. This is because the image is vertical (pointing in the -Y direction)
	// To orient the image along the +X direction, have to add 90 degrees (PI/2 radians)
	this.moveAng = angle + Math.PI / 2;
	this.removeMe = false;
	this.frameNow = 0;
	this.colliderLineSeg = new lineSegment();

	this.draw = function () {
		canvasContext.save();
		canvasContext.translate(this.position.x,this.position.y);
		canvasContext.rotate(this.moveAng + Math.PI);	// Rotate by 180 degrees, so the "top" of the laser is at the cannon, and the bottom points away from the cannon
		canvasContext.scale(-1,-1);
		canvasContext.drawImage(laserPic,
			this.frameNow * laserPicFrameW, 0, laserPicFrameW, laserPicFrameH,
			laserPicFrameW/2, 0, laserPicFrameW * -1, laserPicFrameH * -1);
		canvasContext.restore();
	};

	this.move = function () {
		// laser shot doesn't actually go anywhere
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down

		if (weaponFrameCount >= 54) {
			this.removeMe = true;
			usingTimedWeapon = false;
			weaponFrameCount = 0;
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