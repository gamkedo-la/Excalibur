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
		this.fromShip;
	    this.position = vec2.create();
	    this.colliderAlienAABB = new aabb(alienWidth/2, alienHeight/2);
		this.removeMe = false;
		this.isChuteDrawn = false;
		this.chuteX = Math.random() * chuteThickness + chuteMargin / 10;
		this.chuteY = Math.random() * chuteThickness + chuteMargin;
		this.colliderChuteAABB = new aabb(parachuteW/2, parachuteH/2);
		this.alreadyGotDrawn = false;
		this.isWalking = false;
		this.frameNow = 0;
		this.speedX = 0;
		// TODO: convert to vec2 if we want to track X too
		this.launchY = 0;
		this.typeOfAlien = 'normal';
		this.img = alienPic;
		this.animPicWidth = 43;
		this.animPicHeight = 27;
}


		alienClass.prototype.move = function () {
			if (this.isWalking) {
				if (this.position.x < playerX) {
					this.position.x += alienWalkSpeed;
				}
				if (this.position.x > playerX) {
					this.position.x -= alienWalkSpeed;
				this.colliderAlienAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
				this.colliderAlienAABB.computeBounds();
				}
				if (Math.abs(this.position.x - playerX) < (playerWidth / 2 - alienWidth / 2)) {
					this.removeMe = true;
					hitPlayer();
				}
			}

			if (alienInertiaDriftEnabled) {
				// trajectory inertia from jumping out the ship
				this.speedX = this.fromShip.velocity.v[0];

				if (!this.isChuteDrawn && !this.alreadyGotDrawn) {
				
					var theDiff = Math.round(this.chuteY - this.launchY);

					var positionComparedToLaunchY = Math.round(this.position.y - this.launchY);
				
					// TODO: refactor as a more dynamic parabola equation
					// this was written in 10 mins as proof of concept to see the little buggers have a trajectory
					if (positionComparedToLaunchY < this.fromShip.height / 1) {
						this.position.y += alienFallSpeedNoChute / 100;
					}
					else if (positionComparedToLaunchY < theDiff / 3) {
						this.speedX = this.speedX / 1.25;
						this.position.y += alienFallSpeedNoChute / 3;
					}
					else if (positionComparedToLaunchY < theDiff / 2) {
						this.speedX = this.speedX / 1.5;
						this.position.y += alienFallSpeedNoChute / 2;
					}
					else if (positionComparedToLaunchY < theDiff / 1.5) {
						this.speedX = this.speedX / 1.75;
						this.position.y += alienFallSpeedNoChute / 1.5;
					}
					else {
						this.speedX = this.speedX / 2;
						this.position.y += alienFallSpeedNoChute;
					}

					this.position.x += this.speedX;
					this.colliderAlienAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
					this.colliderAlienAABB.computeBounds();
				} 
				else {
					var randomDriftFactor = (Math.floor(Math.random() * (20 - 3 + 1)) + 3);
					this.position.x += this.speedX / randomDriftFactor;
					this.position.y += (this.isChuteDrawn ? alienFallSpeedWithChute : alienFallSpeedNoChute);
					if (this.position.x > canvas.width - alienWidth){
						this.speedX = 0;
						this.position.x = canvas.width - alienWidth;
					} else if (this.position.x < alienWidth){
						this.speedX = 0;
						this.position.x = alienWidth;
					}
					this.colliderAlienAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
					this.colliderAlienAABB.computeBounds();
				}
			} 
			else {
				// no inertia trajectory drift (ie, aliens drop straight down)
				this.position.y += (this.isChuteDrawn ? alienFallSpeedWithChute : alienFallSpeedNoChute);
				this.colliderAlienAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
				this.colliderAlienAABB.computeBounds();
			}	

			if (this.position.y > canvas.height) { // landing on ground
				if (this.isChuteDrawn) {
					this.position.y = canvas.height;
					this.isWalking = true;
				} else {
					this.removeMe = true;
				}
			}
		};

		alienClass.prototype.draw = function () {
			if (this.isChuteDrawn && !this.isWalking) {
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

			canvasContext.drawImage(this.img,
			this.frameNow * this.animPicWidth, 0,
			this.animPicWidth, this.animPicHeight,
			this.position.x - this.animPicWidth / 2, this.position.y - this.animPicHeight,
			this.animPicWidth, this.animPicHeight);


			if (!this.alreadyGotDrawn) {
				if (this.position.y > this.chuteY ||
					this.fromShip.velocity.x < 0 && this.position.x < this.chuteX ||
					this.fromShip.velocity.x > 0 && this.position.x > canvas.width - this.chuteX)
				{
					this.isChuteDrawn = true;
					this.alreadyGotDrawn = true;
				}
			}
			
			if (this.isWalking) {
				return;
			}
			if (this.isChuteDrawn) {
				this.chuteX = this.position.x - parachuteW / 2;
				this.chuteY = this.position.y - alienHeight;
				this.colliderChuteAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with chute position
				this.colliderChuteAABB.computeBounds();
				if (debug) {
					canvasContext.fillStyle = "gray";
					canvasContext.fillRect(this.chuteX, this.chuteY,
					parachuteW, parachuteH);
				}
			}
		};

//Alien Devil class
function devilAlienClass() {
	this.typeOfAlien = 'devil',
	this.img = devilAlienPic;
	this.animPicWidth = 29;
	this.animPicHeight = 24;
	this.colliderAlienAABB = new aabb(this.animPicWidth/2, this.animPicHeight/2);
	this.colliderChuteAABB = new aabb(parachuteW/2, parachuteH/2);
}

devilAlienClass.prototype = new alienClass();

function spawnAlien(fromShip) {
	var diceRoll = Math.random()*10;
	var newAlien = diceRoll < 3 ? new alienClass() : new devilAlienClass();

	newAlien.fromShip = fromShip;
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
