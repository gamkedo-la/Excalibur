const shipSpawnBandThickness = 200;
const shipSpawnBandMargin = 50;
const shipWidth = 100, shipHeight = 40;

var shipList=[];

function shipClass() {
    this.position = vec2.create(-shipWidth/2, Math.random() * shipSpawnBandThickness + shipSpawnBandMargin);
	this.shipSpeed = 4;
    this.velocity = vec2.create(this.shipSpeed, 0);
	this.removeMe = false;
	this.hasDroppedYet = false;
	var validXPixelTopDrop = 0;
	this.dropX = validXPixelTopDrop;

	this.draw = function() {
		canvasContext.fillStyle = "orange";
		canvasContext.fillRect(this.position.x-shipWidth/2,this.position.y-shipHeight/2,shipWidth,shipHeight);
	}

	this.move = function() {
        vec2.add(this.position, this.position, this.velocity);
	}

	this.edgeOfScreenDetection = function() {
		var movingLeft = this.velocity.x < 0;
		var movingRight = this.velocity.x > 0;
		if( (movingLeft && this.position.x < -shipWidth/2) ||
			(movingRight && this.position.x > canvas.width+shipWidth/2) ) {
			this.removeMe = true;
		}
	}

	this.spawnAliensFromShip = function() {
		var movingLeft = this.velocity.x < 0;
		var movingRight = this.velocity.x > 0;
		if(this.hasDroppedYet == false) {
			if( (movingLeft && this.position.x < this.dropX) ||
				(movingRight && this.position.x > this.dropX)) {
				this.hasDroppedYet = true;
				spawnAlien(this);
			} // crossing drop line
		}
	}
}

function shipSpawn() {
	var newShip = new shipClass;
	shipList.push(newShip);

	newShip.removeMe = false;

	if(Math.random()<0.5) {
		newShip.position.x = -shipWidth/2;
		newShip.velocity.x = 4;
	} else {
		newShip.position.x = canvas.width+shipWidth/2;
		newShip.velocity.x = -4;
	}
	newShip.position.y = Math.random() * shipSpawnBandThickness + shipSpawnBandMargin;
	newShip.velocity.y = 0;

	var safeToDropHere = false;
	while(safeToDropHere == false) {
		safeToDropHere = true;
		
		validXPixelTopDrop = Math.random() * canvas.width;
		if(validXPixelTopDrop < dropMarginFromEdge) {
			safeToDropHere = false;
		} else if(validXPixelTopDrop > canvas.width - dropMarginFromEdge) {
			safeToDropHere = false;
		} else if( Math.abs(canvas.width/2-validXPixelTopDrop) < dropMarginFromCenter) {
			safeToDropHere = false;
		}
	}
	newShip.dropX = validXPixelTopDrop;

	newShip.hasDroppedYet = false;
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
}

function moveShips() {
	for(var i=0;i<shipList.length;i++) {
		shipList[i].move();
		shipList[i].edgeOfScreenDetection();
	}
}
