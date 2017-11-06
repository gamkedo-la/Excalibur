var holdFire, holdLeft, holdRight = false;
var debug = false;	

function handleInput() {
	if(holdFire) {
		if(cReloadLeft <= 0) {
			shotList.push({x:cEndX,y:cEndY,moveAng:cang,speed:cShotSpeed,removeMe:false});
			cReloadLeft = cReloadFrames;
		}
	}
	if(cReloadLeft>0) {
		cReloadLeft--;
	}
	if(holdLeft) {
		cang -= cAngVel;
	}
	if(holdRight) {
		cang += cAngVel;
	}
	if(cang < defaultCannonAng-cannonAngLimit) {
		cang = defaultCannonAng-cannonAngLimit;
	}
	if(cang > defaultCannonAng+cannonAngLimit) {
		cang = defaultCannonAng+cannonAngLimit;
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