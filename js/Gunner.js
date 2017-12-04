function GunnerClass() {
  var gunnerWidth = 75;
  var gunnerHeight = 25;
  var gunnerCannonOffsetX = -5.5;
  var gunnerCannonOffsetY = gunnerHeight / 2;

	this.position = vec2.create(-gunnerWidth/2, Math.random() * shipSpawnBandThickness + shipSpawnBandMargin);
	this.shipSpeed = 4;
	this.velocity = vec2.create(this.shipSpeed, 0);
    this.colliderAABB = new aabb(gunnerWidth/2, gunnerHeight/2);
	this.removeMe = false;
	this.hasDroppedYet = false;
	this.isShooting = false;
	this.dropX = getValidDropX(canvas.width/2);
    this.isDamaged = false;
    this.ang = 0;
	var gravity = vec2.create(0, 0.04);
	var frameNow = 0;
	var numFrames = 3;
	var frameOffsetY = 0;


  if(Math.random()<0.5) {
    this.position.x = -shipWidth/2;
    this.velocity.x = 4;
  } else {
    this.position.x = canvas.width+shipWidth/2;
    this.velocity.x = -4;
    this.dropX += canvas.width/2;
  }
  this.position.y = Math.random() * shipSpawnBandThickness + shipSpawnBandMargin;
  this.velocity.y = 0;

  var velocityX = this.velocity.x;
  var movingLeft = this.velocity.x < 0;
  var movingRight = this.velocity.x > 0;

  var pic = (movingLeft) ? gunnerShipLeftPic : gunnerShipRightPic;

	this.draw = function () {
	  var signOfVelocity = this.velocity.x/Math.abs(this.velocity.x);
   
      if(this.isDamaged){ 
			
			frameOffsetY = gunnerHeight * 2;
			(signOfVelocity > 0) ? frameNow = 2 : frameNow = 0;
			canvasContext.save();
			canvasContext.translate(this.position.x  , this.position.y);
			canvasContext.rotate(this.ang);
			canvasContext.drawImage(pic,
		      frameNow * gunnerWidth, frameOffsetY,
		      gunnerWidth, gunnerHeight,
		      -gunnerWidth / 2, -gunnerHeight/2,
		      gunnerWidth, gunnerHeight);				
			canvasContext.restore();
			this.ang +=  signOfVelocity*0.03;
			this.velocity.x = signOfVelocity*2.8;
			vec2.add(this.velocity, this.velocity, gravity);
			vec2.add(this.position, this.position, this.velocity);

		} else {

			 canvasContext.drawImage(pic,
		      frameNow * gunnerWidth, frameOffsetY,
		      gunnerWidth, gunnerHeight,
		      this.position.x - gunnerWidth / 2, this.position.y - gunnerHeight,
		      gunnerWidth, gunnerHeight);

		}


	};

	this.move = function () {
		vec2.add(this.position, this.position, this.velocity);
		this.colliderAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with ship position
		this.colliderAABB.computeBounds();

		if (this.isShooting) {
	      if (masterFrameDelayTick % 10 === 1) {
	        frameNow++;
	        if (frameNow >= numFrames) {
	          this.isShooting = false;
	          this.velocity.x = velocityX;
	          frameNow--;
	          // shoot bullet back
			  var shotX = this.position.x + gunnerCannonOffsetX;
			  var shotY = this.position.y + gunnerCannonOffsetY;
			  var angle = Math.atan2(playerY - shotY, playerX - shotX);
	          var newShot = new EnemyShotClass(shotX, shotY, angle, gunnerShotSpeed);
	          shotList.push(newShot);
	        }
	      }
		}
	};

	this.edgeOfScreenDetection = function () {
		var movingLeft = this.velocity.x < 0;
		var movingRight = this.velocity.x > 0;
		if ((movingLeft && this.position.x < -this.colliderAABB.width / 2) ||
			(movingRight && this.position.x > canvas.width + this.colliderAABB.width / 2)) {
			this.removeMe = true;
		}
	};

	this.spawnAliensFromShip = function () {
		if (this.hasDroppedYet) {
	      return;
	    }

// 		if (((movingLeft && this.position.x < this.dropX) ||
// 			(movingRight && this.position.x > this.dropX)) && !this.isDamaged ) {
// 			this.hasDroppedYet = true;
// 			this.velocity.x = 0;
// 		    this.isShooting = true;
// 		    frameOffsetY = gunnerHeight;
// 		} // crossing drop line
	}
}

function gunnerSpawn() {
	var newShip = new GunnerClass();
	shipList.push(newShip);
}
