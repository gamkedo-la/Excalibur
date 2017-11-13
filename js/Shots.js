var shotList=[];

function shotClass() {
	cannonShotSpeed = 6;
	cannonReloadFrames = 5;
	cannonReloadLeft = 0;
	this.position = vec2.create(cannonEndX, cannonEndY);

	this.moveAng = cannonAngle;
	this.speed = cannonShotSpeed;
	this.removeMe = false;

	this.draw = function () {
		canvasContext.fillStyle = "yellow";
		canvasContext.fillRect(this.position.x - 1, this.position.y - 1, 3, 3);
	};

	this.move = function () {
		// TODO create a velocity property of shotClass. Use that, instead of computing shotVel in move()
		var shotVel = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
		vec2.scale(shotVel, shotVel, this.speed);
		vec2.add(this.position, this.position, shotVel);
	};

	this.shotCollisionAndBoundaryCheck = function () {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0) {
			this.removeMe = true;
		}

		for (var e = 0; e < shipList.length; e++) {
			// TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)
			if (this.position.y > shipList[e].position.y - shipHeight / 2 && this.position.y < shipList[e].position.y + shipHeight / 2 &&
				this.position.x > shipList[e].position.x - shipWidth / 2 && this.position.x < shipList[e].position.x + shipWidth / 2) {

				score += scoreForShipShot;
				shipList[e].removeMe = true;
				this.removeMe = true;
			}
		}
		for (var t = 0; t < alienList.length; t++) {
			// TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)
			if (this.position.y > alienList[t].position.y - alienHeight && this.position.y < alienList[t].position.y &&
				this.position.x > alienList[t].position.x - alienWidth / 2 && this.position.x < alienList[t].position.x + alienWidth / 2) {
			   
				score += scoreForAlienShot;
				alienList[t].removeMe = true;
				this.removeMe = true;
			} else if (this.position.y > alienList[t].chuteY && this.position.y < alienList[t].chuteY + parachuteH &&
				this.position.x > alienList[t].chuteX && this.position.x < alienList[t].position.x + parachuteW && alienList[t].isChuteDrawn) {
				// TODO replace with line segment/aabb intersection test (use shot velocity to compute previous known position; make line seg from last-known to current position)
			   	
				score += scoreForParachuteShot;
				alienList[t].isChuteDrawn = false;
			} // end of parachute collision check
		} // end of for alienList.length
	}; // end of shotCollisionAndBoundaryCheck function
} // end of shotClass

function drawAndRemoveShots() {
	for(var i=0;i<shotList.length;i++) {
		shotList[i].draw();
	}
	for(var i=shotList.length-1;i>=0;i--) {
		if(shotList[i].removeMe) {
			shotList.splice(i,1);
		}
	}
}

function moveShots() {
	for(var i=0;i<shotList.length;i++) {
		shotList[i].move();
		shotList[i].shotCollisionAndBoundaryCheck();
	}
}
