var playerX,playerY;

const startHitpoints = 3;
var playerHP = startHitpoints;

const playerWidth=50,playerHeight=30;

const playerMoveSpeed=4; // only used if in mouse control scheme

function drawPlayer() {
	// cannon
	canvasContext.strokeStyle="lime";
	canvasContext.lineWidth=6;
	canvasContext.beginPath();
	canvasContext.moveTo(playerX,playerY);
	cannonEndX = playerX+cannonLength*Math.cos(cannonAngle);
	cannonEndY = playerY+cannonLength*Math.sin(cannonAngle);
	canvasContext.lineTo(cannonEndX,cannonEndY);
	canvasContext.stroke();

	// base
	canvasContext.fillStyle="white";
	canvasContext.fillRect(playerX-playerWidth/2,playerY,playerWidth,playerHeight);
}