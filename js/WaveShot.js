var sineShotList=[];

var centerY = cannonEndY;
var centerX = cannonEndX;
var offset = centerY * 5;
var speed = 0.1;
var angle = 0;

function sineShotClass() {
	cannonShotSpeed = 3;
	cannonReloadFrames = 45;
	cannonReloadLeft = 0;
	this.x = cannonEndX;
	this.y = cannonEndY;
	this.moveAng = cannonAngle;
	this.speed = 1;
	this.removeMe = false;

	this.draw = function () {
		canvasContext.fillStyle = "blue";
		canvasContext.fillRect(this.x-1, this.y-1, 6, 6);
	};

	this.move = function () {
		this.y -= this.speed;
        this.x += 50 * Math.sin(this.y/4);
        console.log("x: " + Math.floor(this.x) + ", y: " + Math.floor(this.y));
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
			if (this.y > shipList[e].position.y - shipHeight / 2 && this.y < shipList[e].position.y + shipHeight / 2 &&
				this.x > shipList[e].position.x - shipWidth / 2 && this.x < shipList[e].position.x + shipWidth / 2) {
			   
				score += scoreForShipShot;
				shipList[e].removeMe = true;
				this.removeMe = false;
			}
		}
		for (var t = 0; t < alienList.length; t++) {
			if (this.y > alienList[t].y - alienHeight && this.y < alienList[t].y &&
				this.x > alienList[t].x - alienWidth / 2 && this.x < alienList[t].x + alienWidth / 2) {
			   
				score += scoreForAlienShot;
				alienList[t].removeMe = true;
				this.removeMe = false;
			} else if (this.y > alienList[t].chuteY &&
				this.y < alienList[t].chuteY + parachuteH &&
				this.x > alienList[t].chuteX &&
				this.x < alienList[t].x + parachuteW &&
				alienList[t].isChuteDrawn) {
			   	
				score += scoreForParachuteShot;
				alienList[t].isChuteDrawn = false;
			} // end of parachute collision check
		} // end of for alienList.length
	}; // end of shotCollisionAndBoundaryCheck function
} // end of shotClass
