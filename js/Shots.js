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

		for(var e=0;e<shipList.length;e++) {
			if(shotList[i].y > shipList[e].y-shipHeight/2 && shotList[i].y < shipList[e].y+shipHeight/2 &&
			   shotList[i].x > shipList[e].x-shipWidth/2 && shotList[i].x < shipList[e].x+shipWidth/2) {
			   
			   score += scoreForShipShot;
			   shipList[e].removeMe=true;
			   shotList[i].removeMe = true;
			}
		}
		for(var t=0;t<alienList.length;t++) {
			if(shotList[i].y > alienList[t].y-alienHeight && shotList[i].y < alienList[t].y &&
			   shotList[i].x > alienList[t].x-alienWidth/2 && shotList[i].x < alienList[t].x+alienWidth/2) {
			   
			   score += scoreForAlienShot;
			   alienList[t].removeMe=true;
			   shotList[i].removeMe = true;
			} else if(shotList[i].y > alienList[t].chuteY && shotList[i].y < alienList[t].chuteY+parachuteH
				 && shotList[i].x > alienList[t].chuteX && shotList[i].x < alienList[t].x+parachuteW) {
			   	
			   	score += scoreForParachuteShot;
			   	alienList[t].isChuteDrawn = false;
			}
		}
	}

	for(var i=shotList.length-1;i>=0;i--) {
		if(shotList[i].removeMe) {
			shotList.splice(i,1);
		}
	}
}