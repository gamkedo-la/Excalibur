var usingTimedWeapon = false;
var laserTopPosition = vec2.create(0, -laserPicFrameH);
var laserLowerRight, laserLowerLeft, laserTopRight, laserTopLeft;
var restoreLaserPic = laserPic;

function laserShotClass(x, y, angle, speed) {
	this.speed = speed;
	this.position = vec2.create(x, y);
	this.moveAng = angle;
	this.removeMe = false;
	this.frameNow = 0;
	this.colliderLineSegLaserRight = new lineSegment();
	this.colliderLineSegLaserLeft = new lineSegment();

	this.draw = function () {
		canvasContext.save();
		canvasContext.translate(this.position.x,this.position.y);
		canvasContext.rotate(this.moveAng);
		if (masterFrameDelayTick % 10 == 0) {
				this.frameNow = 0;
			} else if (masterFrameDelayTick % 10 == 5) {
				this.frameNow = 1;
			}
		if (!this.removeMe)	{
			canvasContext.drawImage(laserPic,
				0, this.frameNow * laserPicFrameH, laserPicFrameW, laserPicFrameH,
				0, -laserPicFrameH/2, laserPicFrameW, laserPicFrameH);
		}
		if (weaponFrameCount > 35) {
				laserPic = laserPicEnding;
			}
		canvasContext.restore();
		//drawRect(laserLowerRight.x,laserLowerRight.y,5,5,'red');
		//drawRect(laserTopRight.x,laserTopRight.y,5,5,'lime');
		//console.log(laserLowerRight.x , laserLowerRight.y, laserTopRight.x, laserTopRight.y);
	};

	this.move = function () {
		cannonAngle = angle;
		playerMoveSpeed = 0;
		// laser shot doesn't actually go anywhere
	};

	this.shotCollisionAndBoundaryCheck = function () {
		if (weaponFrameCount >= 54) {
				laserPic = restoreLaserPic;
				this.removeMe = true;
				usingTimedWeapon = false;
				cannonAngle = Math.atan2(mouseCannonY, mouseCannonX);
				weaponFrameCount = 0;
				playerMoveSpeed = 4;
		}
	
		var perpAng = this.moveAng + Math.PI / 2; //perpinducar Angle since we want to go left/right of where barrel is facing
		laserLowerRight = vec2.create(this.position.x + (laserPicFrameH/2) * Math.cos(perpAng),
																	this.position.y + (laserPicFrameH/2) * Math.sin(perpAng));
		laserLowerLeft = vec2.create(this.position.x - (laserPicFrameH/2) * Math.cos(perpAng),
																this.position.y - (laserPicFrameH/2) * Math.sin(perpAng));
		laserTopRight = vec2.create(laserLowerRight.x + laserPicFrameW * Math.cos(this.moveAng),
																laserLowerRight.y + laserPicFrameW * Math.sin(this.moveAng));
		laserTopLeft = vec2.create(laserLowerLeft.x + laserPicFrameW * Math.cos(this.moveAng), 
															laserLowerLeft.y + laserPicFrameW * Math.sin(this.moveAng));
	
		this.colliderLineSegLaserRight.setEndPoints(laserLowerRight,laserTopRight);
		this.colliderLineSegLaserLeft.setEndPoints(laserLowerLeft,laserTopLeft);
	
		powerUpBoxList.forEach(function(powerUpBox) {
				if (isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSegLaserRight) 
					|| isColliding_AABB_LineSeg(powerUpBox.colliderAABB, this.colliderLineSegLaserLeft)) {
					powerupExplosion(powerUpBox.position.x - powerUpWidth / 2,
									powerUpBox.position.y - powerUpWidth / 2);
					shieldPowerUpSound.play();
						var useMaxDuration = true;
						score += scoreForPowerUpShot;
						powerUpBox.setActive(useMaxDuration);
				}
		}, this);
	
		this.checkCollisions(shipList);
		this.checkCollisions(missileList);
		this.checkCollisions(alienList);
	}; // end of shotCollisionAndBoundaryCheck function

	this.checkCollisions = function(list) {
		for (var t = 0; t < list.length; t++) {
			list[t].checkLineCollision(this.colliderLineSegLaserRight, list[t].position);
			list[t].checkLineCollision(this.colliderLineSegLaserLeft, list[t].position);
		}
	};
}; // end of laserShotClass