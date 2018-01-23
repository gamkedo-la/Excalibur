var playerX,playerY;

const startHitpoints = 3;
var playerHP = startHitpoints;
var playerInvulFrames = 35;
var playerInvulTimer = 0;

const playerWidth=40,playerHeight=40;

var playerColliderAABB = new aabb(playerWidth/2, playerHeight/2);

var playerMoveSpeed=4; // only used if in mouse control scheme
var playerIceMoveSpeedRight = 0;
var playerIceMoveSpeedLeft = 0;
var defaultCannonAng = -Math.PI/2;
var cannonAngLimit = Math.PI * 0.47;
var cannonLength=40,cannonAngle=defaultCannonAng,cannonAngleVelocity=0.1;
var cannonEndX, cannonEndY;
var cannonReloadLeft = 0;
var cannonWidth = 18;
var playerTopLeft, playerLowerRight;

const DRAW_TARGET_RETICLE = true; // an aimer

var playerUpgradeSpeed = 0;
var playerUpgradeROF = 0;
var playerUpgradeHealth = 0;
const MAX_UPGRADES_PER_KIND = 3;
var playerMoveUpgradeIncrement = 1.6;
var playerIceMoveUpgradeIncrement = 1.0;

function resetPlayerUpgrades() {
  playerUpgradeSpeed = 0;
  playerUpgradeROF = 0;
  playerUpgradeHealth = 0;
}

function resetPlayer() {
  resetPowerUps();
  score=0;
  playerX = canvas.width/2;
  playerHP = startHitpoints;
  playerInvulTimer = 0;
  cannonReloadFrames = 5;
  cannonWaveReloadFrames = 17;
  resetPlayerUpgrades();
}

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
  if(currentBackground != BEACH_BACKGROUND) {  // normal control for zebes, computer, fantasy

    if(holdLeft) {
      if (playerX - playerWidth/2 > 0) {
        playerX -= playerMoveSpeed + playerMoveUpgradeIncrement*playerUpgradeSpeed;
      } else {
        playerX = playerWidth/2;
      }
    }
    if(holdRight) {
      if (playerX + playerWidth/2 < canvas.width) {
        playerX += playerMoveSpeed + playerMoveUpgradeIncrement*playerUpgradeSpeed;
      } else {
        playerX = canvas.width - playerWidth/2;
      }
    }

  } else { // special beach ice movement
    if(holdLeft) {
      if (playerX - playerWidth/2 > 0) {
        if (playerIceMoveSpeedLeft < 2) {
          playerIceMoveSpeedLeft -= playerIceMoveSpeedRight;
          playerIceMoveSpeedRight = 0;
          playerIceMoveSpeedLeft += 0.2 + playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
        } else if (playerIceMoveSpeedLeft < 4) {
          playerIceMoveSpeedLeft += 0.5 + playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
        }
        playerX -= playerIceMoveSpeedLeft;
      } else {
        playerX = playerWidth/2;
      }
    } else if (!holdLeft && playerIceMoveSpeedLeft > 0 && playerX - playerWidth/2 < canvas.width) {
      playerIceMoveSpeedLeft -= 0.08 + 0.25*playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
      playerX -= playerIceMoveSpeedLeft;
      if (playerX - playerWidth/2 < 0) {
      playerX = playerWidth/2;
      playerIceMoveSpeedLeft = 0;
      }  
    } 
    if(holdRight) {
      if (playerX + playerWidth/2 < canvas.width) {
        if (playerIceMoveSpeedRight < 2) {
          playerIceMoveSpeedRight -= playerIceMoveSpeedLeft;
          playerIceMoveSpeedLeft = 0;
          playerIceMoveSpeedRight += 0.2 + playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
        } else if (playerIceMoveSpeedRight < 4) {
          playerIceMoveSpeedRight += 0.5 + playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
        }
        playerX += playerIceMoveSpeedRight;
      } else {
        playerX = canvas.width - playerWidth/2;
      }
    } else if (!holdRight && playerIceMoveSpeedRight > 0 && playerX + playerWidth/2 < canvas.width) {
      playerIceMoveSpeedRight -= 0.08 + 0.25*playerIceMoveUpgradeIncrement*playerUpgradeSpeed;
      playerX += playerIceMoveSpeedRight;
      if (playerX + playerWidth/2 > canvas.width) {
        playerX = canvas.width - playerWidth/2;
        playerIceMoveSpeedRight = 0;
      } 
    } 
  } // end of else (beach ice control)

  playerTopLeft = vec2.create(playerX - playerWidth/2, playerY - playerHeight/2);
  playerLowerRight = vec2.create(playerX + playerWidth/2, playerY + playerHeight/2);
  playerColliderAABB.setCenter(playerX, playerY);	// Synchronize AABB position with player position
  playerColliderAABB.computeBounds();
  
  if(playerInvulTimer > 0) {
    playerInvulTimer--;
  }
}

function hitPlayer() {
  if(!orchestratorMode && !carnageMode && playerInvulTimer <= 0){
    playerHP--;
    playerInvulTimer = playerInvulFrames;
    playerHitExplosion(playerX,playerY);
    explosionSound.play();
  }
  if (playerHP <= 0) {
    gameOverManager.startGameOverSequence();
  }
}
