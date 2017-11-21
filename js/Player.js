var playerX,playerY;

const startHitpoints = 30;
var playerHP = startHitpoints;

const playerWidth=50,playerHeight=30;

var playerColliderAABB = new aabb(playerWidth/2, playerHeight/2);

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

function movePlayer() {
  if(holdLeft) {
    if (playerX - playerWidth/2 > 0) {
      playerX -= playerMoveSpeed;
    } else {
      playerX = playerWidth/2;
    }

  }
  if(holdRight) {
    if (playerX + playerWidth/2 < canvas.width) {
      playerX += playerMoveSpeed;
    } else {
      playerX = canvas.width - playerWidth/2;
    }
  }

  playerColliderAABB.setCenter(playerX, playerY);	// Synchronize AABB position with player position
  playerColliderAABB.computeBounds();
}

function hitPlayer() {
  playerHP--;
  if (playerHP <= 0) {
    resetGame();
  }
}
