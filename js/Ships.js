const shipSpawnBandThickness = 200;
const shipSpawnBandMargin = 50;

var shipSpeed = 4;
const ew = 100, eh = 40;

var shipList=[];

function shipSpawn() {
	var newShip = {};

	newShip.removeMe = false;

	if(Math.random()<0.5) {
		newShip.x = -ew/2;
		newShip.xv = 4;
	} else {
		newShip.x = canvas.width+ew/2;
		newShip.xv = -4;
	}
	newShip.y = Math.random() * shipSpawnBandThickness + shipSpawnBandMargin;
	newShip.yv = 0;

	var validXPixelTopDrop = 0;

	var safeToDropHere = false;
	while(safeToDropHere == false) {
		safeToDropHere = true;
		
		validXPixelTopDrop = Math.random() * canvas.width;
		if(validXPixelTopDrop < dropMarginFromEdge) {
			safeToDropHere = false;
		} else if(validXPixelTopDrop > canvas.width - dropMarginFromEdge) {
			safeToDropHere = false;
		} else if( Math.abs(canvas.width/2-validXPixelTopDrop) < dropMarginFromCenter) {
			safeToDropHere = false;
		}
	}

	newShip.dropX = validXPixelTopDrop;

	newShip.hasDroppedYet = false;

	shipList.push(newShip);
}

function handleShips() {
	// planes
	canvasContext.fillStyle = "orange";
	for(var i=0;i<shipList.length;i++) {
		canvasContext.fillRect(shipList[i].x-ew/2,shipList[i].y-eh/2,ew,eh);
		shipList[i].x += shipList[i].xv;
		shipList[i].y += shipList[i].yv;

		var movingLeft = shipList[i].xv < 0;
		var movingRight = shipList[i].xv > 0;
		if(shipList[i].hasDroppedYet == false) {
			if( (movingLeft && shipList[i].x < shipList[i].dropX) ||
				(movingRight && shipList[i].x > shipList[i].dropX)) {
				shipList[i].hasDroppedYet = true;
				spawnTroop(shipList[i]);
			} // crossing drop line
		} else {
			if( (movingLeft && shipList[i].x < -ew/2) ||
				(movingRight && shipList[i].x > canvas.width+ew/2) ) {
				shipList[i].removeMe = true;
			}
		}
	} // for each plane
	for(var i=shipList.length-1;i>=0;i--) {
		if(shipList[i].removeMe) {
			shipList.splice(i,1);
		}
	}
}
