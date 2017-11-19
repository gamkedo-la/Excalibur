var sineShotList=[];

function waveShotClass(x, y, angle, speed) {
	this.position = vec2.create(x, y);
	this.position.x = cannonEndX;
	this.position.y = cannonEndY;
	this.moveAng = angle;
	this.speed = speed;
	this.removeMe = false;
	this.startX = cannonEndX;
	this.startY = cannonEndY;
	this.perpendicularLineStartX = cannonEndX;
	this.perpendicularLineStartY = cannonEndY;
	this.endX = null;
	this.endY = null;
	this.perpendicularLineEndX = null;
	this.perpendicularLineEndY = null;
	this.centerLineX = cannonEndX;
	this.centerLineY = cannonEndY;
	this.centerLineSpeed = 600;
	this.firstTimeSettingPerpLineEnd = true;
	this.sineWaveControl = 0;
	this.counter = 0;
	this.perpendicularVectorEndX = null;
	this.perpendicularVectorEndY = null;
	const SET_PERP_LENGTH = 100;

	this.draw = function () {
		if (this.centerLineX > canvas.width || this.centerLineX < 0 || this.centerLineY < 0){	
			//canvasContext.lineWidth = 2;
			//canvasContext.beginPath();
			canvasContext.moveTo(this.startX,this.startY);
			if (this.endX != null && this.endY != null) {
				//canvasContext.lineTo(this.endX,this.endY);
				//canvasContext.strokeStyle = "steelblue";
				//canvasContext.stroke();
				perpendicularVectorX = -(this.startY - this.endY);
				perpendicularVectorY = this.startX - this.endX;
				var perpendicularLength = SET_PERP_LENGTH / Math.hypot(perpendicularVectorX, perpendicularVectorY);
				this.sineWaveControl = Math.sin(this.counter);
				this.counter += 0.21;
				perpendicularLength *= this.sineWaveControl
				perpendicularVectorX *= perpendicularLength;
				perpendicularVectorY *= perpendicularLength; 
				//canvasContext.beginPath();
				//canvasContext.moveTo(this.perpendicularLineStartX,this.perpendicularLineStartY);
				this.perpendicularVectorEndX = this.perpendicularLineStartX + perpendicularVectorX;
				this.perpendicularVectorEndY = this.perpendicularLineStartY + perpendicularVectorY;
				//canvasContext.lineTo(this.perpendicularVectorEndX,this.perpendicularVectorEndY);
				//console.log(Math.floor(this.perpendicularVectorEndX) + "   " + Math.floor(this.perpendicularVectorEndY));
				//canvasContext.strokeStyle = "orange";
				//canvasContext.stroke();
				canvasContext.fillStyle = "steelblue";
				canvasContext.fillRect(this.position.x - 5, this.position.y - 5, 12, 12);
			}
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
			this.perpendicularLineEndX += this.speed * Math.cos(this.moveAng);
			this.perpendicularLineEndY += this.speed * Math.sin(this.moveAng);	
		}
		this.position.x = this.perpendicularVectorEndX;
		this.position.y = this.perpendicularVectorEndY;
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0) {
			this.removeMe = true;
		}

		for (var e = 0; e < shipList.length; e++) {
			if (this.position.y > shipList[e].position.y - shipHeight / 2 && this.position.y < shipList[e].position.y + shipHeight / 2 &&
				this.position.x > shipList[e].position.x - shipWidth / 2 && this.position.x < shipList[e].position.x + shipWidth / 2 &&
				!shipList[e].isDamaged) {
			   
				score += scoreForShipShot;
				shipList[e].isDamaged = true;
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
		} // end of for alienList.length
	}; // end of shotCollisionAndBoundaryCheck function
} // end of waveShotClass
