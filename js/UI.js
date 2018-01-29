function drawScore() {
	if (!orchestratorMode) {
			 colorText("Score: " + numberWithCommas(score),canvas.width-20,30,"white","20px Arial","right");
	}
	if (twoPlayerMode && !orchestratorMode) {
		colorText("[1] for Paradropper",127,50,"white","15px Arial","right");
		colorText("[Q] for Gunship",102,70,"white","15px Arial","right");
		colorText("[A] for Missile Strike",134,90,"white","15px Arial","right");
		colorText("[ESC] to return to Main Menu",195,110,"white","15px Arial","right");
	} else if(orchestratorMode) {	
		colorText("[1] for Paradropper",127,50,"white","15px Arial","right");
		colorText("[2] for Gunship",100,70,"white","15px Arial","right");
		colorText("[3] for Missile Strike",133,90,"white","15px Arial","right");
		colorText("[ESC] to return to Main Menu",195,110,"white","15px Arial","right");
		colorText("[C] to copy new Wave",148,130,"fuchsia","15px Arial","right");
			
		colorText("spawnFrameCount: " + orchestratorSpawnFrameCount,canvas.width - 10, 30,"white","20px Arial","right");

		colorText("frameCount: " + frameCount, canvas.width - 10, 50, "white", "20px Arial", "right");
		colorText("Time Elapsed: " + timeElapsedInSeconds.toFixed(1), canvas.width - 10, 70, "white", "20px Arial", "right");
		colorText("Frame Rate: " + (frameCount / timeElapsedInSeconds).toFixed(1), canvas.width - 10, 90, "white", "20px Arial", "right");

		colorText("Shots Fired: " + shotsFired, canvas.width - 10, 110, "white", "20px Arial", "right");
		colorText("Number Of Hits: " + shotsHit, canvas.width - 10, 130, "white", "20px Arial", "right");
		colorText("Ships Hit: " + shotsHitShips, canvas.width - 10, 150, "white", "20px Arial", "right");
		colorText("Aliens Hit: " + shotsHitAliens, canvas.width - 10, 170, "white", "20px Arial", "right");
		colorText("Parachutes Hit: " + shotsHitParachutes, canvas.width - 10, 190, "white", "20px Arial", "right");
	}

	if (debug) {
			
			var lineHeight = 15;
			var drawTextOutY = 100;
			colorText("hitpoints: " + playerHP,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("shots: " + shotList.length,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("ships: " + shipList.length,100,drawTextOutY,"cyan","15px Arial");
			drawTextOutY+=lineHeight;
			colorText("aliens: " + alienList.length,100,drawTextOutY,"cyan","15px Arial");

	}
}

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawLives() {
    //colorText("lives: " + playerHP,canvas.width-780,30,"white","20px Arial","left");
    var gap = 5;
    var cornerX = 10;
    var cornerY = 8;
    var maxHeartsToShow = startHitpoints+playerUpgradeHealth;
    for(var i = 0; i < maxHeartsToShow; i++) {
        canvasContext.drawImage(
        	(i < playerHP ? heartPic : heartlessPic)
        	, cornerX + i * (heartPic.width + gap), cornerY);
    }
}