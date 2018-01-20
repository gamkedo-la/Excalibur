function waveShotClass(x, y, angle, speed) {
	const SET_PERP_LENGTH = 100;
	this.position = vec2.create(x, y);
	this.prevPosition = vec2.create(x, y);
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

			/*
			// collision segment debug draw
			canvasContext.beginPath();
			canvasContext.strokeStyle="lime";
			canvasContext.moveTo(this.prevPosition.x,
									this.prevPosition.y);
			canvasContext.lineTo(this.position.x,
									this.position.y);
			canvasContext.stroke();*/
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
		// Copy the shot's previous position for collisions
		vec2.copy(this.prevPosition,this.position);

		this.position.x = this.perpendicularLineEndX;
		this.position.y = this.perpendicularLineEndY;
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < -SET_PERP_LENGTH || this.position.x > canvas.width + SET_PERP_LENGTH || this.position.y < 0) {
			this.removeMe = true;
		}

		var hitBar = vec2.create(0,0);
		vec2.sub(hitBar,this.position,this.prevPosition);
		if(vec2.len(hitBar) > 200) { // hack fix to throw out first frame
			return;
		}

        // Create line segment collider from current & previous positions
        this.colliderLineSeg.setEndPoints(this.prevPosition, this.position);

        /*powerUpBoxList.forEach(function(powerUpBox) {
            if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSeg)) {
            	powerupExplosion(this.position.x,this.position.y);
            	shieldPowerUpSound.play();
                var useMaxDuration = true;
                score += scoreForPowerUpShot;
                powerUpBox.setActive(useMaxDuration);
            }
        }, this);*/

        this.checkCollisions(shipList);
        this.checkCollisions(missileList);
        this.checkCollisions(alienList);
    }; // end of shotCollisionAndBoundaryCheck function
    
    this.checkCollisions = function(list) {
        for (var i = 0; i < list.length; i++) {
            list[i].checkLineCollision(this.colliderLineSeg, this.position);
        }
    };
}; // end of waveShotClass
