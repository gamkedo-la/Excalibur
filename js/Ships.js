const enemySpawnBandThickness = 200;
const enemySpawnBandMargin = 50;

var enemySpeed = 4;
const ew = 100, eh = 40;

var enemyList=[];

function enemySpawn() {
	var newEnemy = {};

	newEnemy.removeMe = false;

	if(Math.random()<0.5) {
		newEnemy.x = -ew/2;
		newEnemy.xv = 4;
	} else {
		newEnemy.x = canvas.width+ew/2;
		newEnemy.xv = -4;
	}
	newEnemy.y = Math.random() * enemySpawnBandThickness + enemySpawnBandMargin;
	newEnemy.yv = 0;

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

	newEnemy.dropX = validXPixelTopDrop;

	newEnemy.hasDroppedYet = false;

	enemyList.push(newEnemy);
}

function handleShips() {
	// planes
	canvasContext.fillStyle = "orange";
	for(var i=0;i<enemyList.length;i++) {
		canvasContext.fillRect(enemyList[i].x-ew/2,enemyList[i].y-eh/2,ew,eh);
		enemyList[i].x += enemyList[i].xv;
		enemyList[i].y += enemyList[i].yv;

		var movingLeft = enemyList[i].xv < 0;
		var movingRight = enemyList[i].xv > 0;

		if(enemyList[i].hasDroppedYet == false) {
			if( (movingLeft && enemyList[i].x < enemyList[i].dropX) ||
				(movingRight && enemyList[i].x > enemyList[i].dropX)) {
				enemyList[i].hasDroppedYet = true;
				spawnTroop(enemyList[i]);
			} // crossing drop line
		} else {
			if( (movingLeft && enemyList[i].x < -ew/2) ||
				(movingRight && enemyList[i].x > canvas.width+ew/2) ) {
				enemyList[i].removeMe = true;
			}
		}
	} // for each plane
	for(var i=enemyList.length-1;i>=0;i--) {
		if(enemyList[i].removeMe) {
			enemyList.splice(i,1);
		}
	}
}
