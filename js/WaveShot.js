var sineShotList=[];

var centerY = cannonEndY;
var centerX = cannonEndX;
var offset = centerY * 5;
var speed = 0.1;
var angle = 0;

function sineShotClass(x, y, angle, speed) {
	this.position = vec2.create(x, y);
	this.moveAng = angle;
	this.speed = speed;
	this.removeMe = false;

	this.draw = function () {
		canvasContext.fillStyle = "blue";
		canvasContext.fillRect(this.position.x-1, this.position.y-1, 6, 6);
	};

	this.move = function () {
		this.position.y -= this.speed;
        this.position.x += 20 * Math.sin(this.position.y/22);
        console.log("x: " + Math.floor(this.position.x) + ", y: " + Math.floor(this.position.y));
		//this.x = centerX + Math.sin(angle/2) * offset;
		//this.y = centerX + Math.sin(angle/2) * offset;
		//centerY += this.speed * Math.sin(this.moveAng);
		//centerX += this.speed * Math.cos(this.moveAng);
	};

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
} // end of shotClass
