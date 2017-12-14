function waveShotClass(x, y, angle, speed) {
	const SET_PERP_LENGTH = 100;
	this.position = vec2.create(x, y);
	this.velocity = vec2.create(this.perpendicularLineEndX, this.perpendicularLineEndY);
	this.moveAng = angle;
	this.speed = speed;
	this.removeMe = false;
	this.startX = this.perpendicularLineStartX = this.centerLineX = cannonEndX;
	this.startY = this.perpendicularLineStartY = this.centerLineY = cannonEndY;
	this.endX = this.perpendicularLineEndX = this.perpendicularLineEndX = this.perpendicularVectorX = null;
	this.endY = this.perpendicularLineEndY = this.perpendicularLineEndY = this.perpendicularVectorY = null;
	this.perpendicularLength = null;
	this.sineWaveControl = this.counter = 0;
	this.centerLineSpeed = 600;
	this.colliderLineSeg = new lineSegment();

	this.draw = function () {
		if (this.centerLineX > canvas.width || this.centerLineX < 0 || this.centerLineY < 0){	
			this.perpendicularVectorX = -(this.startY - this.endY);
			this.perpendicularVectorY = this.startX - this.endX;
			this.perpendicularLength = SET_PERP_LENGTH / Math.hypot(this.perpendicularVectorX, this.perpendicularVectorY);
			this.perpendicularLength *= this.sineWaveControl;
			this.sineWaveControl = Math.sin(this.counter);
			this.counter += 0.1;
			this.perpendicularVectorX *= this.perpendicularLength;
			this.perpendicularVectorY *= this.perpendicularLength; 
			this.perpendicularLineEndX = this.perpendicularLineStartX + this.perpendicularVectorX;
			this.perpendicularLineEndY = this.perpendicularLineStartY + this.perpendicularVectorY;
			if (masterFrameDelayTick % 16 == 0) {
				this.frameNow = 0;
			} else if (masterFrameDelayTick % 16 == 2) {
					this.frameNow = 1;
			} else if (masterFrameDelayTick % 16 == 4){
					this.frameNow = 2;
			} else if (masterFrameDelayTick % 16 == 8) {
					this.frameNow = 3;
			}
			canvasContext.drawImage(waveShotPic,
			this.frameNow * waveShotPicFrameW, 0,
			waveShotPicFrameW, waveShotPicFrameH,
			this.position.x - waveShotPicFrameW / 2,
			this.position.y - waveShotPicFrameH / 2,
			waveShotPicFrameW, waveShotPicFrameH);
		}
	};

	this.move = function () {
		this.centerLineX += this.centerLineSpeed * Math.cos(this.moveAng);
		this.centerLineY += this.centerLineSpeed * Math.sin(this.moveAng);
		if (this.centerLineX > canvas.width || this.centerLineX < 0 || this.centerLineY < 0){
			this.endX = this.centerLineX;
			this.endY = this.centerLineY;
			this.centerLineSpeed = 0;
			this.perpendicularLineStartX += this.speed * Math.cos(this.moveAng);
			this.perpendicularLineStartY += this.speed * Math.sin(this.moveAng);
		}
		this.position.x = this.perpendicularLineEndX;
		this.position.y = this.perpendicularLineEndY;
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < -SET_PERP_LENGTH || this.position.x > canvas.width + SET_PERP_LENGTH || this.position.y < 0) {
			this.removeMe = true;
		}
		// Compute the shot's previous position
		var prevPos = vec2.create();
        vec2.sub(prevPos, this.position, this.velocity);

        // Create line segment collider from current & previous positions
        this.colliderLineSeg.setEndPoints(prevPos, this.position);

        powerUpBoxList.forEach(function(powerUpBox) {
            if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSeg)) {
            	powerupExplosion(this.position.x,this.position.y);
            	shieldPowerUpSound.play();
                var useMaxDuration = true;
                score += scoreForPowerUpShot;
                powerUpBox.setActive(useMaxDuration);
                this.removeMe = false;
            }
        }, this);

        for (var e = 0; e < shipList.length; e++) {
            if (isColliding_AABB_LineSeg(shipList[e].colliderAABB, this.colliderLineSeg) && !shipList[e].isDamaged) {

                shipHitExplosion(this.position.x,this.position.y);

                if(!shipList[e].isDamaged){
                    score += scoreForShipShot;
                    shipList[e].isDamaged = true;
                }

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
} // end of waveShotClass
