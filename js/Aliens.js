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
}

function spawnAlien(fromShip) {
	var newAlien = new alienClass;
	newAlien.x = fromShip.x;
	newAlien.y = fromShip.y;
	alienList.push(newAlien);
}

function handleAliens() {
	// aliens
	for(var i=0;i<alienList.length;i++) {
		canvasContext.fillStyle = "red";
		canvasContext.fillRect(alienList[i].x-alienWidth/2,alienList[i].y-alienHeight,alienWidth,alienHeight);

		if(alienList[i].isWalking) {
			if(alienList[i].x<playerX) {
				alienList[i].x += alienWalkSpeed;
			}
			if(alienList[i].x>playerX) {
				alienList[i].x -= alienWalkSpeed;
			}
			if( Math.abs(alienList[i].x - playerX) < (playerWidth/2-alienWidth/2) ) {
				alienList[i].removeMe = true;
				playerHP--;
				if(playerHP<=0) {
					resetGame();
				}
			}
			continue; // skip rest of draw and motion code which are only for air travel
		}

		if(alienList[i].isChuteDrawn) {
			canvasContext.fillStyle = "gray";
			alienList[i].chuteX = alienList[i].x-parachuteW/2; 
			alienList[i].chuteY = alienList[i].y-alienHeight-parachuteH;
			canvasContext.fillRect(alienList[i].chuteX,alienList[i].chuteY,
								parachuteW,parachuteH);
		}

		if(alienList[i].alreadyGotDrawn == false &&
			alienList[i].y > alienList[i].chuteY) {

			alienList[i].isChuteDrawn = true;
			alienList[i].alreadyGotDrawn=true;
		}
		alienList[i].y += (alienList[i].isChuteDrawn ? alienFallSpeedWithChute : alienFallSpeedNoChute);

		if(alienList[i].y > canvas.height) { // landing on ground
			if(alienList[i].isChuteDrawn) {
				alienList[i].y = canvas.height;
				alienList[i].isWalking = true;
			} else {
				alienList[i].removeMe = true;
			}
		}
	}
	for(var i=alienList.length-1;i>=0;i--) {
		if(alienList[i].removeMe) {
			alienList.splice(i,1);
		}
	}
}