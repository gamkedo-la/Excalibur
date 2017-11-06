const dropBelowPlaneMargin = 10;
const tw = 17, th = 25;
const parachuteW = tw+15, parachuteH = 25;
const trooperFallSpeedNoChute = 3.5;
const trooperFallSpeedWithChute = 1.5;
const troopWalkSpeed = 2;
const dropMarginFromCenter = pw + 30;
const dropMarginFromEdge = 50;
const chuteThickness = 100;
const chuteMargin = 300;

var trooperList=[];

function spawnTroop(fromPlane) {
	trooperList.push( {x:fromPlane.x, y:fromPlane.y+dropBelowPlaneMargin, removeMe:false,
						isChuteDrawn:false, chuteY:Math.random()*chuteThickness+chuteMargin,
						alreadyGotDrawn:false, isWalking:false} );
}

function handleAliens() {
	// paratroopers
	for(var i=0;i<trooperList.length;i++) {
		canvasContext.fillStyle = "red";
		canvasContext.fillRect(trooperList[i].x-tw/2,trooperList[i].y-th,tw,th);

		if(trooperList[i].isWalking) {
			if(trooperList[i].x<px) {
				trooperList[i].x += troopWalkSpeed;
			}
			if(trooperList[i].x>px) {
				trooperList[i].x -= troopWalkSpeed;
			}
			if( Math.abs(trooperList[i].x - px) < (pw/2-tw/2) ) {
				trooperList[i].removeMe = true;
				playerHP--;
				if(playerHP<=0) {
					resetGame();
				}
			}
			continue; // skip rest of draw and motion code which are only for air travel
		}

		if(trooperList[i].isChuteDrawn) {
			canvasContext.fillStyle = "gray";
			trooperList[i].chuteX = trooperList[i].x-parachuteW/2; 
			trooperList[i].chuteY = trooperList[i].y-th-parachuteH;
			canvasContext.fillRect(trooperList[i].chuteX,trooperList[i].chuteY,
								parachuteW,parachuteH);
		}

		if(trooperList[i].alreadyGotDrawn == false &&
			trooperList[i].y > trooperList[i].chuteY) {

			trooperList[i].isChuteDrawn = true;
			trooperList[i].alreadyGotDrawn=true;
		}
		trooperList[i].y += (trooperList[i].isChuteDrawn ? trooperFallSpeedWithChute : trooperFallSpeedNoChute);

		if(trooperList[i].y > canvas.height) { // landing on ground
			if(trooperList[i].isChuteDrawn) {
				trooperList[i].y = canvas.height;
				trooperList[i].isWalking = true;
			} else {
				trooperList[i].removeMe = true;
			}
		}
	}
	for(var i=trooperList.length-1;i>=0;i--) {
		if(trooperList[i].removeMe) {
			trooperList.splice(i,1);
		}
	}
}