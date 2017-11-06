var px,py;

const startHitpoints = 3;
var playerHP = startHitpoints;

const pw=50,ph=30;

const scoreForPlaneShot = 100;
const scoreForTrooperShot = 50;
const scoreForParachuteShot = 75;

var score=0;

var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI*0.42;
var clen=40,cang=defaultCannonAng,cAngVel=0.1;
var cEndX, cEndY;
var cShotSpeed = 5;
var cReloadFrames = 5;
var cReloadLeft = 0;

function drawPlayer() {
	// cannon
	canvasContext.strokeStyle="lime";
	canvasContext.lineWidth=6;
	canvasContext.beginPath();
	canvasContext.moveTo(px,py);
	cEndX = px+clen*Math.cos(cang);
	cEndY = py+clen*Math.sin(cang);
	canvasContext.lineTo(cEndX,cEndY);
	canvasContext.stroke();

	// base
	canvasContext.fillStyle="white";
	canvasContext.fillRect(px-pw/2,py,pw,ph);
}