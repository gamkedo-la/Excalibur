const KEY_TAB = 9;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_D = 68;

var holdFire, holdLeft, holdRight = false;
var secondaryFire = false;
var debug = false;

var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI*0.42;
var cannonLength=40,cannonAngle=defaultCannonAng,cannonAngleVelocity=0.1;
var cannonEndX, cannonEndY;
var cannonShotSpeed = 5;
var cannonReloadFrames = 5;
var cannonReloadLeft = 0;	

function handleInput() {
	if(holdFire && !secondaryFire) {
		if(cannonReloadLeft <= 0) {
			var newShot = new shotClass;
			shotList.push(newShot);
			cannonReloadLeft = cannonReloadFrames;
		}
	} else if(holdFire && secondaryFire) {
		if(cannonReloadLeft <= 0) {
			var newShot = new sineShotClass;
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
	evt.preventDefault();
	switch(evt.keyCode) {
		case KEY_TAB:
			secondaryFire = !secondaryFire;
			break;
		case KEY_SPACE:
			holdFire = true;
			break;
		case KEY_LEFT:
			holdLeft = true;
			break;
		case KEY_RIGHT:
			holdRight = true;
			break;
		case KEY_D:
			debug = !debug;
			break;
	}
}
function keyRelease(evt) {
	switch(evt.keyCode) {
		case KEY_SPACE:
			holdFire = false;
			break;
		case KEY_LEFT:
			holdLeft = false;
			break;
		case KEY_RIGHT:
			holdRight = false;
			break;
	}
}