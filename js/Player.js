var playerX,playerY;

const startHitpoints = 3;
var playerHP = startHitpoints;

const playerWidth=50,playerHeight=30;

const scoreForShipShot = 100;
const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;

var score=0;

var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI*0.42;
var cannonLength=40,cannonAngle=defaultCannonAng,cannonAngleVelocity=0.1;
var cannonEndX, cannonEndY;
var cannonShotSpeed = 5;
var cannonReloadFrames = 5;
var cannonReloadLeft = 0;

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