var shotList=[];

function handleShots() {
	canvasContext.fillStyle = "yellow";
	for(var i=0;i<shotList.length;i++) {
		canvasContext.fillRect(shotList[i].x-1,shotList[i].y-1,3,3);
		shotList[i].x += shotList[i].speed * Math.cos(shotList[i].moveAng);
		shotList[i].y += shotList[i].speed * Math.sin(shotList[i].moveAng);

		// note: note checking screen bottom since we can't shoot down
		if(shotList[i].x<0 || shotList[i].x>canvas.width || shotList[i].y<0) {
			shotList[i].removeMe = true;
		}

		for(var e=0;e<enemyList.length;e++) {
			if(shotList[i].y > enemyList[e].y-eh/2 && shotList[i].y < enemyList[e].y+eh/2 &&
			   shotList[i].x > enemyList[e].x-ew/2 && shotList[i].x < enemyList[e].x+ew/2) {
			   
			   score += scoreForPlaneShot;
			   enemyList[e].removeMe=true;
			   shotList[i].removeMe = true;
			}
		}
		for(var t=0;t<trooperList.length;t++) {
			if(shotList[i].y > trooperList[t].y-th && shotList[i].y < trooperList[t].y &&
			   shotList[i].x > trooperList[t].x-tw/2 && shotList[i].x < trooperList[t].x+tw/2) {
			   
			   score += scoreForTrooperShot;
			   trooperList[t].removeMe=true;
			   shotList[i].removeMe = true;
			} else if(shotList[i].y > trooperList[t].chuteY && shotList[i].y < trooperList[t].chuteY+parachuteH
				 && shotList[i].x > trooperList[t].chuteX && shotList[i].x < trooperList[t].x+parachuteW) {
			   	
			   	score += scoreForParachuteShot;
			   	trooperList[t].isChuteDrawn = false;
			}
		}
	}

	for(var i=shotList.length-1;i>=0;i--) {
		if(shotList[i].removeMe) {
			shotList.splice(i,1);
		}
	}
}