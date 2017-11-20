var playerX,playerY;

const startHitpoints = 3;
var playerHP = startHitpoints;

const playerWidth=50,playerHeight=30;

var playerColliderAABB = new aabb(playerWidth/2, playerHeight/2);

const playerMoveSpeed=4; // only used if in mouse control scheme

// var playerHasShield = false;
// var shieldStrength = 7;

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

  // //shield
  // if(playerHasShield) {
  //   canvasContext.fillStyle = 'rgba(52, 166, 253, 0.' + shieldStrength + ')';
  //   canvasContext.beginPath();
  //   canvasContext.arc(playerX, playerY, playerWidth + 2, 0, Math.PI * 2, true);
  //   canvasContext.fill();
  // }
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
