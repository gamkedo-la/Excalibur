const dropBelowShipMargin = 10;
const alienWidth = 17, alienHeight = 25;
const parachuteW = alienWidth+15, parachuteH = 25;
const alienFallSpeedNoChute = 3.5;
const alienFallSpeedWithChute = 1.5;
const alienWalkSpeed = 2;
const dropMarginFromCenter = playerWidth + 30;
const dropMarginFromEdge = 50;
const chuteThickness = 100;
const chuteMargin = 300;

var alienList=[];

function alienClass() {
	this.x = 0;
	this.y = 0;
	this.removeMe = false;
	this.isChuteDrawn = false;
	this.chuteX = 0;
	this.chuteY = Math.random()*chuteThickness+chuteMargin;
	this.alreadyGotDrawn = false;
	this.isWalking = false;

	this.draw = function() {
		canvasContext.fillStyle = "red";
		canvasContext.fillRect(this.x-alienWidth/2,this.y-alienHeight,alienWidth,alienHeight);
		
		if(this.alreadyGotDrawn == false &&
			this.y > this.chuteY) {

			this.isChuteDrawn = true;
			this.alreadyGotDrawn = true;
		}
		
		if(this.isWalking) {
			return;
		}
			if(this.isChuteDrawn) {
				canvasContext.fillStyle = "gray";
				this.chuteX = this.x-parachuteW/2; 
				this.chuteY = this.y-alienHeight-parachuteH;
				canvasContext.fillRect(this.chuteX,this.chuteY,
									parachuteW,parachuteH);
			}

	}

	this.move = function() {
		if(this.isWalking) {
			if(this.x<playerX) {
				this.x += alienWalkSpeed;
			}
			if(this.x>playerX) {
				this.x -= alienWalkSpeed;
			}
			if( Math.abs(this.x - playerX) < (playerWidth/2-alienWidth/2) ) {
				this.removeMe = true;
				playerHP--;
				if(playerHP<=0) {
					resetGame();
				}
			}
		}

		this.y += (this.isChuteDrawn ? alienFallSpeedWithChute : alienFallSpeedNoChute);

		if(this.y > canvas.height) { // landing on ground
			if(this.isChuteDrawn) {
				this.y = canvas.height;
				this.isWalking = true;
			} else {
				this.removeMe = true;
			}
		}
	}
}

function spawnAlien(fromShip) {
	var newAlien = new alienClass;
	newAlien.x = fromShip.position.x;
	newAlien.y = fromShip.position.y;
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
