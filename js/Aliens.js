const dropBelowShipMargin = 10;
const alienWidth = 17, alienHeight = 25;
const parachuteW = alienWidth+24, parachuteH = 25;
const alienFallSpeedNoChute = 3.5;
const alienFallSpeedWithChute = 1.5;
const alienWalkSpeed = 2;
const dropMarginFromCenter = playerWidth + 30;
const dropMarginFromEdge = 50;
const chuteThickness = 100;
const chuteMargin = 300;

var alienList = [];

// TODO: make it a toggle for testing/debugging
var alienInertiaDriftEnabled = true;

var alienClass = function() {
	this.width = alienWidth;
	this.height = alienHeight;
	this.position = vec2.create();
	this.colliderAlienAABB = new aabb(alienWidth/2, alienHeight/2);
	this.chuteX = Math.random() * chuteThickness + chuteMargin / 10;
	this.chuteY = Math.random() * chuteThickness + chuteMargin;
	this.colliderChuteAABB = new aabb(parachuteW/2, parachuteH/2);
	this.speedX = 0;
	this.speedY = 0;
	this.grav = 0.15;
	this.freeFallFriction = 0.012195;
	this.chuteFriction = 0.0666666;
	// TODO: convert to vec2 if we want to track X too
	this.launchY = 0;
	this.typeOfAlien = 'normal';
	this.img = alienPic;
	this.animPicWidth = 47;
	this.animPicHeight = 29;
	
	//TODO make removeMe a state
	this.states = {
		freeFalling: 0,
		parachuting: 1,
		noChute: 2,
		walking: 3,
	}
	this.state = this.states.freeFalling;
	this.removeMe = false;
	this.frameNow = 0;
};


alienClass.prototype.move = function () {
	switch(this.state){
		case this.states.freeFalling:
			// If below chute deploy height or too close to screen edge then deploy chute
			if (this.position.y > this.chuteY ||
					this.speedX < 0 && this.position.x < this.chuteX ||
					this.speedX > 0 && this.position.x > canvas.width - this.chuteX
			) {
				this.state = this.states.parachuting;
			}
			
			// Do not put a break here
		case this.states.noChute:
			this.speedX -= Math.sign(this.speedX) * this.speedX * this.speedX * this.freeFallFriction;
			this.speedY += this.grav - this.speedY * this.speedY * this.freeFallFriction;
			
			// TODO: maybe change this to speed based?
			if (this.position.y > canvas.height) { // die on ground impact
				this.removeMe = true;
			}
			
			break;
		case this.states.parachuting:
			this.speedX = 0;
			this.speedY += this.grav - this.chuteFriction * this.speedY * this.speedY;
			
			// TODO: This needs another pass (not sure what it actually does or why we need it)
			if (this.position.x < canvas.width - alienWidth && this.position.x > alienWidth){
				var randomDriftFactor = (Math.floor(Math.random() * (20 - 3 + 1)) + 3);
				this.speedX = randomDriftFactor * Math.sign(this.speedX);
			}
			
			if (this.position.y > canvas.height) { // landing on ground
				this.speedY = 0;
				this.position.y = canvas.height;
				this.state = this.states.walking;
			}
			
			this.colliderChuteAABB.setCenter(this.position.x + this.speedX, this.position.y + this.speedY);	// Synchronize AABB position with chute position
			this.colliderChuteAABB.computeBounds();
			
			break;
		case this.states.walking:
			var distanceToPlayer = playerX - this.position.x;
			this.speedX = alienWalkSpeed * Math.sign(distanceToPlayer);
			this.speedY = 0;
			
			if (Math.abs(distanceToPlayer) < (playerWidth / 2 + alienWidth / 2)) {
				this.removeMe = true;
				hitPlayer();
			}
			
			break;
	}
	
	this.position.x += this.speedX;
	this.position.y += this.speedY;
	this.colliderAlienAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
	this.colliderAlienAABB.computeBounds();
};

alienClass.prototype.draw = function () {
	if (this.state === this.states.parachuting) {
		if (masterFrameDelayTick % 3 == 1) {
			if (this.frameNow == 2) {
				this.frameNow = 1;
			} else {
				this.frameNow = 2;
			}
		}

		if (masterFrameDelayTick % 30 == 1 && this.typeOfAlien == 'devil') {
			var shotX = this.position.x ;
			var shotY = this.position.y - this.animPicHeight/2;
			var angle = Math.atan2(playerY - shotY, playerX - shotX);
			var newShot = new EnemyShotClass(shotX, shotY, angle, 3);
			shotList.push(newShot);
		}
	} else {
		this.frameNow = 0;
	}

	if(this.state === this.states.noChute) {
		this.frameNow = 3;
	}

	canvasContext.drawImage(this.img,
	                        this.frameNow * this.animPicWidth, 0,
	                        this.animPicWidth, this.animPicHeight,
	                        this.position.x - this.animPicWidth / 2, this.position.y - this.animPicHeight,
	                        this.animPicWidth, this.animPicHeight
	);

	if (this.state === this.states.parachuting) {
		if (debug) {
			canvasContext.fillStyle = "gray";
			canvasContext.fillRect(this.position.x - parachuteW / 2, this.position.y - alienHeight,
			parachuteW, parachuteH);
		}
	}
};

alienClass.prototype.checkLineCollision = function (lineSegment, projectileLocation) {
	if(this.removeMe) {
		return;
	}
	
	if(isColliding_AABB_LineSeg(this.colliderAlienAABB, lineSegment)) {
		alienHitExplosion(this.position.x,this.position.y);
		score += scoreForAlienShot;
		shotsHit++;
		shotsHitAliens++;
		this.removeMe = true;
		
		return true;
	} else if (this.state === this.states.parachuting
	           && isColliding_AABB_LineSeg(this.colliderChuteAABB, lineSegment)
	) {
		score += scoreForParachuteShot;
		shotsHit++;
		shotsHitParachutes++;
		this.state = this.states.noChute;
	}
	
	return false;
}

//Alien Devil class
function devilAlienClass() {
	this.typeOfAlien = 'devil',
	this.img = devilAlienPic;
	this.animPicWidth = 31;
	this.animPicHeight = 26;
	this.colliderAlienAABB = new aabb(this.animPicWidth/2, this.animPicHeight/2);
	this.colliderChuteAABB = new aabb(parachuteW/2, parachuteH/2);
}

devilAlienClass.prototype = new alienClass();

function spawnAlien(fromShip) {
	var diceRoll = Math.random()*10;
	var newAlien = diceRoll < 3 ? new alienClass() : new devilAlienClass();

	// trajectory inertia from jumping out the ship
	newAlien.speedX = fromShip.velocity.v[0];
	newAlien.position = vec2.create(fromShip.position.v[0], fromShip.position.v[1] + fromShip.height);
	newAlien.launchY = newAlien.position.y;
	alienList.push(newAlien);
}

function drawAndRemoveAliens() {
	for(var i=0;i<alienList.length;i++) {
		alienList[i].draw();
	}
	for(var i=alienList.length-1;i>=0;i--) {
		if(alienList[i].removeMe) {
			alienList.splice(i,1);
		}
	}
}

function moveAliens() {
	for(var i=0;i<alienList.length;i++) {
		alienList[i].move();
	}	
}
