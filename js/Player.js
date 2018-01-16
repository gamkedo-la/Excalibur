var playerX,playerY;

const startHitpoints = 3;
var playerHP = startHitpoints;
var playerInvulFrames = 35;
var playerInvulTimer = 0;

const playerWidth=40,playerHeight=40;

var playerColliderAABB = new aabb(playerWidth/2, playerHeight/2);

var playerMoveSpeed=4; // only used if in mouse control scheme
var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI * 0.47;
var cannonLength=40,cannonAngle=defaultCannonAng,cannonAngleVelocity=0.1;
var cannonEndX, cannonEndY;
var cannonWaveShotSpeed = 3.4;
var cannonShotSpeed = 15;
var cannonReloadFrames = 5;
var cannonWaveReloadFrames = 17; //// amped to be more powerful than fork shot
var cannonLaserReloadFrames = 64;
var cannonReloadLeft = 0;
var cannonWidth = 18;
var playerTopLeft, playerLowerRight;

const DRAW_TARGET_RETICLE = true; // an aimer

function drawPlayer() {
  
  if (DRAW_TARGET_RETICLE && controlScheme == CONTROL_SCHEME_MOUSE_AND_KEYS_MOVING)
  {
    canvasContext.beginPath();
    canvasContext.lineWidth=2;
    canvasContext.setLineDash([2,8]);
    canvasContext.moveTo(playerX,playerY);
    canvasContext.lineTo(mouseX,mouseY);
    canvasContext.closePath();
    canvasContext.strokeStyle = "rgba(100, 90, 80, 0.5)";
    canvasContext.stroke();
    canvasContext.drawImage(targetReticlePic,mouseX-20,mouseY-20);
  }
  
  if(playerInvulTimer %4 > 2){
    return;
  }
  // base
  // canvasContext.fillStyle="white";
  // canvasContext.fillRect(playerX-playerWidth/2,playerY,playerWidth,playerHeight);
  canvasContext.drawImage(tankBodyPic,playerX - playerWidth/2,playerY - playerHeight/2);

  // cannon
  // canvasContext.strokeStyle="lime";
  // canvasContext.lineWidth=6;
  // canvasContext.beginPath();
  // canvasContext.moveTo(playerX,playerY);
  // cannonEndX = playerX+cannonLength*Math.cos(cannonAngle);
  // cannonEndY = playerY+cannonLength*Math.sin(cannonAngle);
  // canvasContext.lineTo(cannonEndX,cannonEndY);
  // canvasContext.stroke();

   cannonEndX = playerX + (cannonLength-10)*Math.cos(cannonAngle);
   cannonEndY = playerY + (cannonLength-10)*Math.sin(cannonAngle);

   canvasContext.save();
   canvasContext.translate(playerX ,playerY)
   canvasContext.rotate(cannonAngle + Math.PI/2);
   canvasContext.drawImage(tankCannonPic, - cannonWidth/2, -cannonLength + cannonLength/4 );
   canvasContext.restore();
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
  playerTopLeft = vec2.create(playerX - playerWidth/2, playerY - playerHeight/2);
  playerLowerRight = vec2.create(playerX + playerWidth/2, playerY + playerHeight/2);
  playerColliderAABB.setCenter(playerX, playerY);	// Synchronize AABB position with player position
  playerColliderAABB.computeBounds();
  
  if(playerInvulTimer > 0) {
    playerInvulTimer--;
  }
}

function hitPlayer() {
  if(!orchestratorMode && playerInvulTimer <= 0){
    playerHP--;
    playerInvulTimer = playerInvulFrames;
    playerHitExplosion(playerX,playerY);
    explosionSound.play();
  }
  if (playerHP <= 0) {
    gameOverManager.startGameOverSequence();
  }
}
