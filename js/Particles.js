var particleList = [];

function ParticleClass(x, y, image) {
	this.height = this.width = 3;
	this.pixelOffset = 5;
	this.posOrNeg = Math.random() < 0.5 ? -1 : 1;
	this.x = (x + (Math.random() * (this.posOrNeg*this.pixelOffset)));
	this.y = y;
	this.moveTimer = 0;
	this.removeMe = false;
	this.color = image;

	const FLOATING_FACTOR = 0.09;

	this.draw = function() {
		canvasContext.drawImage(
			this.color, 
			Math.floor(image.width/2+1), Math.floor((image.height/2)-2), 1,1, 
			this.x,this.y, this.width, this.height);
	}

	this.move = function() {
		this.moveTimer += FLOATING_FACTOR;
		this.y += FLOATING_FACTOR;
		if (this.moveTimer >= 1) {
			this.removeMe = true;
		}
	}
}

function drawAndRemoveParticles() {
	for(var i=0;i<particleList.length;i++) {
		particleList[i].draw();
	}
	for(var i=particleList.length-1;i>=0;i--) {
		if(particleList[i].removeMe) {
			particleList.splice(i,1);
		}
	}
}

function moveParticles() {
	for(var i=0;i<particleList.length;i++) {
		particleList[i].move();
	}	
}

function particleSpawn(x, y, image) {
	particleList.push(new ParticleClass(x, y, image));
}