function DropshipClass() {
	//EnemyShipClass(width, height, speed, angle, health)
	EnemyShipClass.call(this, 100, 34, 4, 0, 1);
	
	this.sprite = new SpriteSheetClass(dropshipPic, this.width, this.height);
	this.spriteRows = {
		flying: 0,
		damaged: 1,
	};
	this.numFrames = 2;
	this.ticksPerFrame = 40;
	this.frameRow = this.spriteRows.flying;
	
	this.parentMove = this.move;
	this.move = function(){
		this.incrementTick();
		this.parentMove();
		this.spawnAliensFromShip();
	};
	
	this.spawnAliensFromShip = function () {
		if(this.canDeploy()){
			this.hasDroppedYet = true;
			spawnAlien(this);
		}
	};
}

function dropshipSpawn() {
	shipList.push(new DropshipClass());
	shipsTotal++;
}
