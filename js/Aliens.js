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
    this.position = vec2.create();
	this.removeMe = false;
	this.isChuteDrawn = false;
	this.chuteX = 0;
	this.chuteY = Math.random()*chuteThickness+chuteMargin;
	this.alreadyGotDrawn = false;
	this.isWalking = false;

	this.draw = function() {

		// canvasContext.fillStyle = "red";
		// canvasContext.fillRect(this.position.x-alienWidth/2,this.position.y-alienHeight,alienWidth,alienHeight);
		
		//Upload alien image here
		 canvasContext.drawImage(alienPic, this.position.x-alienWidth/2 , this.position.y-alienHeight);	

		if(this.alreadyGotDrawn == false &&
			this.position.y > this.chuteY) {

			this.isChuteDrawn = true;
			this.alreadyGotDrawn = true;
		}
		
		if(this.isWalking) {
			return;
		}
			if(this.isChuteDrawn) {
				canvasContext.fillStyle = "gray";
				this.chuteX = this.position.x-parachuteW/2; 
				this.chuteY = this.position.y-alienHeight-parachuteH;
				canvasContext.fillRect(this.chuteX,this.chuteY,
									parachuteW,parachuteH);
			}

	}

	this.move = function() {
		if(this.isWalking) {
			if(this.position.x<playerX) {
				this.position.x += alienWalkSpeed;
			}
			if(this.position.x>playerX) {
				this.position.x -= alienWalkSpeed;
			}
			if( Math.abs(this.position.x - playerX) < (playerWidth/2-alienWidth/2) ) {
				this.removeMe = true;
				playerHP--;
				if(playerHP<=0) {
					resetGame();
				}
			}
		}

		this.position.y += (this.isChuteDrawn ? alienFallSpeedWithChute : alienFallSpeedNoChute);

		if(this.position.y > canvas.height) { // landing on ground
			if(this.isChuteDrawn) {
				this.position.y = canvas.height;
				this.isWalking = true;
			} else {
				this.removeMe = true;
			}
		}
	}
}

function spawnAlien(fromShip) {
	var newAlien = new alienClass;
    newAlien.position = vec2.clone(fromShip.position);
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
