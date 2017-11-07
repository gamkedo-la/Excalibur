var holdFire, holdLeft, holdRight = false;
var debug = false;

var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI*0.42;
var cannonLength=40,cannonAngle=defaultCannonAng,cannonAngleVelocity=0.1;
var cannonEndX, cannonEndY;
var cannonShotSpeed = 5;
var cannonReloadFrames = 5;
var cannonReloadLeft = 0;	

function handleInput() {
	if(holdFire) {
		if(cannonReloadLeft <= 0) {
			var newShot = new shotClass;
			shotList.push(newShot);
			cannonReloadLeft = cannonReloadFrames;
		}
	}
	if(cannonReloadLeft>0) {
		cannonReloadLeft--;
	}
	if(holdLeft) {
		cannonAngle -= cannonAngleVelocity;
	}
	if(holdRight) {
		cannonAngle += cannonAngleVelocity;
	}
	if(cannonAngle < defaultCannonAng-cannonAngLimit) {
		cannonAngle = defaultCannonAng-cannonAngLimit;
	}
	if(cannonAngle > defaultCannonAng+cannonAngLimit) {
		cannonAngle = defaultCannonAng+cannonAngLimit;
	}
}

function keyPress(evt) {
	switch(evt.keyCode) {
		case 32:
			holdFire = true;
			break;
		case 37:
			holdLeft = true;
			break;
		case 39:
			holdRight = true;
			break;
		case 68:
			debug = !debug;
			break;
	}
}
function keyRelease(evt) {
	switch(evt.keyCode) {
		case 32:
			holdFire = false;
			break;
		case 37:
			holdLeft = false;
			break;
		case 39:
			holdRight = false;
			break;
	}
}