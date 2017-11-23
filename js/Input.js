const KEY_TAB = 9;
const KEY_SPACE = 32;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_D = 68;
const KEY_A = 65;
const DIGIT_0 = 48; //only for debug

const pauseOnLoseFocus = true;

var holdFire, holdLeft, holdRight = false;
var secondaryFire = false;
var debug = false;

const CONTROL_SCHEME_KEYS_STATIONARY = 0;
const CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING = 1;

var controlScheme = CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING;

var mouseY = 0;
var mouseX = 0;

function initializeInput() {
	document.addEventListener("keydown",keyPress);
	document.addEventListener("keyup",keyRelease);
	window.addEventListener("focus", windowOnFocus);
 	window.addEventListener("blur", windowOnBlur);

	switch(controlScheme) {
		case CONTROL_SCHEME_KEYS_STATIONARY:
			console.log("Using control scheme: arrow/WASD keys only");
			break;
		case CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING:
			console.log("Using control scheme: arrow/WASD keys steer, mouse aims");
			canvas.addEventListener('mousemove', calculateMousePos);
			canvas.addEventListener('mousedown', function() {holdFire=true;});
			canvas.addEventListener('mouseup', function() {holdFire=false;});
			break;
	}
}

function windowOnFocus() {
	if(!gameRunning) {
		gameRunning = true;
		gameUpdate = setInterval(update, 1000/30);
		gameShipSpawn = setInterval(shipSpawn, 1000*2);
		gameGunnerSpawn = setInterval(gunnerSpawn, 3000*2);
	}
};

function windowOnBlur() {
	if (pauseOnLoseFocus) {
		clearInterval(gameShipSpawn);
		clearInterval(gameGunnerSpawn);
		gameRunning = false;
		clearInterval(gameUpdate);
	}
};

function handleInput() {
	if(holdFire && !secondaryFire) {
		if(cannonReloadLeft <= 0) {
			var newShot = new shotClass(cannonEndX, cannonEndY, cannonAngle, cannonShotSpeed);
			shotList.push(newShot);
			playRegularShotSound();
			cannonReloadLeft = cannonReloadFrames;
		}
	}else if(holdFire && secondaryFire) {
		if(cannonReloadLeft <= 0) {
			var newShot = new waveShotClass(cannonEndX, cannonEndY, cannonAngle, cannonWaveShotSpeed);
			shotList.push(newShot);
			cannonReloadLeft = cannonWaveReloadFrames;
		}
	}
	if(cannonReloadLeft>0) {
		cannonReloadLeft--;
	}
	switch(controlScheme) {
		case CONTROL_SCHEME_KEYS_STATIONARY:
			if(holdLeft) {
				cannonAngle -= cannonAngleVelocity;
			}
			if(holdRight) {
				cannonAngle += cannonAngleVelocity;
			}
			break;
		case CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING:
			var mouseCannonY = mouseY - playerY;
			var mouseCannonX = mouseX - playerX;

			// cannon was flipping left-to-right when mouse goes below deck
			if (mouseCannonY > 0 && mouseCannonX < 0) {
				mouseCannonY = -mouseCannonY;
			}

      	cannonAngle = Math.atan2(mouseCannonY, mouseCannonX);

			movePlayer();
			break;
	}

	if (cannonAngle < defaultCannonAng - cannonAngLimit) {
		cannonAngle = defaultCannonAng - cannonAngLimit;
	} else 	if (cannonAngle > defaultCannonAng + cannonAngLimit) {
		cannonAngle = defaultCannonAng + cannonAngLimit;
	}
}

function keyPress(evt) {
	// TODO: test for game controls instead, for now let's just re-enable function keys
	if (evt.key.toLowerCase().substr(0, 1) != "f") {
		evt.preventDefault();
	}

	switch (evt.keyCode) {

		case KEY_TAB:
			secondaryFire = !secondaryFire;
			break;
		case KEY_SPACE:
			holdFire = true;
			break;
		case KEY_LEFT:
		case KEY_A:
			holdLeft = true;
			break;
		case KEY_RIGHT:
		case KEY_D:
			holdRight = true;
			break;
		case DIGIT_0:
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
		case KEY_A:
			holdLeft = false;
			break;
		case KEY_RIGHT:
		case KEY_D:
			holdRight = false;
			break;
	}
}

function calculateMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    mouseX = evt.clientX - rect.left - root.scrollLeft;
    mouseY = evt.clientY - rect.top - root.scrollTop;
}
