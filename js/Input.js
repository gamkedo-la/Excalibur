var holdFire, holdLeft, holdRight = false;
var debug = false;	

function handleInput() {
	if(holdFire) {
		if(cannonReloadLeft <= 0) {
			shotList.push({x:cannonEndX,y:cannonEndY,moveAng:cannonAngle,speed:cannonShotSpeed,removeMe:false});
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