const debugFont = "16px Tahoma";
const debugFontColor = "white";
const debugRightMargin = 8;
const debugLineHeight = 18;
const debugLineHeightPadding = 2;
const debugLineGap = 12;

function drawScore() {
	if (!orchestratorMode) {
		colorText("Score: " + numberWithCommas(score),canvas.width-10,20,"white","20px Arial","right");
		if (!carnageMode && !twoPlayerMode) {
			drawRect(canvas.width-110,29,100,13,'black');
			drawRect(canvas.width-110,29,waveProgress,13,'orange');
		}
	}

	if (twoPlayerMode) {
		colorText("[1] for Paradropper",127,50,"white","15px Arial","right");
		colorText("[Q] for Gunship",102,70,"white","15px Arial","right");
		colorText("[A] for Missile Strike",134,90,"white","15px Arial","right");
		colorText("[ESC] to return to Main Menu",195,110,"white","15px Arial","right");
	}


	if (debug) {

		var debugCurrentLinePos = 40;

		colorText("spawnFrameCount: " + orchestratorSpawnFrameCount, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("frameCount: " + frameCount, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		debugCurrentLinePos = debugCurrentLinePos + debugLineGap;

		colorText("Ships Spawned: " + shipsTotal, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Ships Active: " + shipList.length, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Gunships Total: " + gunShipsTotal, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Dropships Total: " + dropShipsTotal, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		// extra line gap
		debugCurrentLinePos = debugCurrentLinePos + debugLineGap;

		colorText("Shots Fired: " + shotsFired, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Number Of Hits: " + shotsHit, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Ships Hit: " + shotsHitShips, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Aliens Hit: " + shotsHitAliens, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Parachutes Hit: " + shotsHitParachutes, canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		// extra line gap
		debugCurrentLinePos = debugCurrentLinePos + debugLineGap;

		colorText("Time Elapsed: " + timeElapsedInSeconds.toFixed(1), canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");
		debugCurrentLinePos = debugCurrentLinePos + debugLineHeight + debugLineHeightPadding;

		colorText("Frame Rate: " + (frameCount / timeElapsedInSeconds).toFixed(1), canvas.width - debugRightMargin, debugCurrentLinePos + debugLineHeight, debugFontColor, debugFont, "right");


	}
}

function numberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function drawLives() {
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