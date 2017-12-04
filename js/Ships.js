const shipSpawnBandThickness = 200;
const shipSpawnBandMargin = 50;
const shipWidth = 100, shipHeight = 32;

var shipList=[];

function shipClass() {
	this.position = vec2.create(-shipWidth/2, Math.random() * shipSpawnBandThickness + shipSpawnBandMargin);
	this.shipSpeed = 4;
	this.velocity = vec2.create(this.shipSpeed, 0);
    this.colliderAABB = new aabb(shipWidth/2, shipHeight/2);
	this.removeMe = false;
	this.isDamaged = false;
	this.ang = 0;
	var gravity = vec2.create(0, 0.04);
	this.hasDroppedYet = false;
	var validXPixelTopDrop = 0;
	this.dropX = validXPixelTopDrop;
	var frameBool = false; //means 0.Will toggle between 0 and 1 till ship dies.
	this.frameNow = 0;
	var frameCounter = 0;

	this.draw = function () {
	    var signOfVelocity = this.velocity.x/Math.abs(this.velocity.x);
		frameCounter++;
		if(frameCounter%40 == 0){
		   frameBool = !frameBool; // Used to toggle between high flame and low flame animation. Has a subtle effect on movement of spaceship.
		}
		
		this.frameNow = frameBool ? 1 : 0;
		this.pic = this.velocity.x < 0 ? spaceshipLeftPic : spaceshipRightPic;
		
		if(this.isDamaged){ 
			this.frameNow = 2;
			canvasContext.save();
			canvasContext.translate(this.position.x  , this.position.y);
			canvasContext.rotate(this.ang);
			canvasContext.drawImage(this.pic,
				this.frameNow * spaceshipPicFrameW, 0,
				spaceshipPicFrameW, spaceshipPicFrameH,
				-spaceshipPicFrameW / 2,  -spaceshipPicFrameH / 2,
				spaceshipPicFrameW, spaceshipPicFrameH);				
			canvasContext.restore();
			this.ang +=  signOfVelocity*0.02;
			this.velocity.x = signOfVelocity*2.6;
			vec2.add(this.velocity, this.velocity, gravity);
			vec2.add(this.position, this.position, this.velocity);
		} else {
			canvasContext.drawImage(this.pic,
				this.frameNow * spaceshipPicFrameW, 0,
				spaceshipPicFrameW, spaceshipPicFrameH,
				this.position.x - spaceshipPicFrameW / 2, this.position.y - spaceshipPicFrameH / 2,
				spaceshipPicFrameW, spaceshipPicFrameH);

		}
	};

	this.move = function () {
		vec2.add(this.position, this.position, this.velocity);
		this.colliderAABB.setCenter(this.position.x, this.position.y);	// Synchronize AABB position with ship position
		this.colliderAABB.computeBounds();
	};

	this.edgeOfScreenDetection = function () {
		var movingLeft = this.velocity.x < 0;
		var movingRight = this.velocity.x > 0;
		var movingDown = this.velocity.y > 0;

		if ((movingLeft && this.position.x < -this.colliderAABB.width / 2) ||
			(movingRight && this.position.x > canvas.width + this.colliderAABB.width / 2) ||
			(movingDown && this.position.y > canvas.height)) {
			this.removeMe = true;
		}
	};

	this.spawnAliensFromShip = function () {
		if (!this.isDamaged) {
			var movingLeft = this.velocity.x < 0;
			var movingRight = this.velocity.x > 0;
			if (this.hasDroppedYet == false) {
				if ((movingLeft && this.position.x < this.dropX) ||
					(movingRight && this.position.x > this.dropX)) {
					this.hasDroppedYet = true;
					spawnAlien(this);
				} // crossing drop line
			} // end of hasDroppedYet
		} // end of if(!this.isDamaged)
	}; // end of spawnAliensFromShip
} // end of ShipClass

function shipSpawn() {
	var newShip = new shipClass();
	newShip.removeMe = false;
	shipList.push(newShip);

	if(Math.random()<0.5) {
		newShip.position.x = -shipWidth/2;
		newShip.velocity.x = 4;
	} else {
		newShip.position.x = canvas.width+shipWidth/2;
		newShip.velocity.x = -4;
	}
	newShip.position.y = Math.random() * shipSpawnBandThickness + shipSpawnBandMargin;
	newShip.velocity.y = 0;

	newShip.dropX = getValidDropX(canvas.width);

	newShip.hasDroppedYet = false;
}

function getValidDropX(maxWidth) {
  var safeToDropHere = false;
  while(safeToDropHere === false) {
    safeToDropHere = true;

    validXPixelTopDrop = Math.random() * maxWidth;
    if(validXPixelTopDrop < dropMarginFromEdge) {
      safeToDropHere = false;
    } else if(validXPixelTopDrop > canvas.width - dropMarginFromEdge) {
      safeToDropHere = false;
    } else if( Math.abs(canvas.width/2-validXPixelTopDrop) < dropMarginFromCenter) {
      if (!alienInertiaDriftEnabled) {
        safeToDropHere = false;
      }
    }
  }

  return validXPixelTopDrop;
}

function drawAndRemoveShips() {
	for(var i=0;i<shipList.length;i++) {
		shipList[i].draw();
		shipList[i].spawnAliensFromShip();
	}
	for(var i=shipList.length-1;i>=0;i--) {
		if(shipList[i].removeMe) {
			shipList.splice(i,1);
		}
	}
	console.log(shipList);
}

function moveShips() {
	for(var i=0;i<shipList.length;i++) {
		shipList[i].move();
		shipList[i].edgeOfScreenDetection();
	}
}
