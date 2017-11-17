var sineShotList=[];

function waveShotClass(x, y, angle, speed) {
	this.position = vec2.create(x, y);
	this.position.x = cannonEndX;
	this.position.y = cannonEndY;
	this.moveAng = angle;
	this.speed = speed;
	this.removeMe = false;
	var startX = cannonEndX;
	var startY = cannonEndY;
	var perpendicularLineStartX = cannonEndX;
	var perpendicularLineStartY = cannonEndY;
	var endX = null;
	var endY = null;
	var perpendicularLineEndX = null;
	var perpendicularLineEndY = null;
	var centerLineX = cannonEndX;
	var centerLineY = cannonEndY;
	var centerLineSpeed = 6000;
	var firstTimeSettingPerpLineEnd = true;
	var perpendicularOffset = 100;

	this.draw = function () {
		if (centerLineX > canvas.width || centerLineX < 0 || centerLineY < 0){	
			canvasContext.lineWidth = 2;
			canvasContext.beginPath();
			canvasContext.moveTo(startX,startY);
			if (endX != null && endY != null) {
				canvasContext.lineTo(endX,endY);
				canvasContext.strokeStyle = "blue";
				canvasContext.stroke();
				if (firstTimeSettingPerpLineEnd){
					perpendicularLineEndX = -endY;
					perpendicularLineEndY = endX;
					firstTimeSettingPerpLineEnd = false;
				}
				console.log(Math.floor(perpendicularLineEndX) + "   " + Math.floor(perpendicularLineEndY));
				canvasContext.beginPath();
				canvasContext.moveTo(perpendicularLineStartX,perpendicularLineStartY);
				canvasContext.lineTo(perpendicularLineEndX,perpendicularLineEndY);
				canvasContext.strokeStyle = "orange";
				canvasContext.stroke();
			}
		}
		if (cannonReloadLeft == 0) {
			this.removeMe = true;
			endX = null;
			endY = null;
		}
	};

	this.move = function () {
		this.position.x += this.speed * Math.cos(this.moveAng);
		this.position.y += this.speed * Math.sin(this.moveAng);
		centerLineX += centerLineSpeed * Math.cos(this.moveAng);
		centerLineY += centerLineSpeed * Math.sin(this.moveAng);
		if (centerLineX > canvas.width + 800 || centerLineX < -800 || centerLineY < -600){
			endX = centerLineX;
			endY = centerLineY;
			centerLineSpeed = 0;
			perpendicularLineStartX += this.speed * Math.cos(this.moveAng);
			perpendicularLineStartY += this.speed * Math.sin(this.moveAng);
			perpendicularLineEndX += this.speed * Math.cos(this.moveAng);
			perpendicularLineEndY += this.speed * Math.sin(this.moveAng);	
		}
	};
		//this.position.y -= this.speed;
       // this.position.x += 20 * Math.sin(this.position.y/22);
        //console.log("x: " + Math.floor(this.position.x) + ", y: " + Math.floor(this.position.y));
		//this.x = centerX + Math.sin(angle/2) * offset;
		//this.y = centerX + Math.sin(angle/2) * offset;
		//centerY += this.speed * Math.sin(this.moveAng);
		//centerX += this.speed * Math.cos(this.moveAng);

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down
		if (this.y < 0) {
			this.removeMe = true;
		}

		for (var e = 0; e < shipList.length; e++) {
			if (this.position.y > shipList[e].position.y - shipHeight / 2 && this.position.y < shipList[e].position.y + shipHeight / 2 &&
				this.position.x > shipList[e].position.x - shipWidth / 2 && this.position.x < shipList[e].position.x + shipWidth / 2) {
			   
				score += scoreForShipShot;
				shipList[e].removeMe = true;
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
