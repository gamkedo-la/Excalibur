var particleList = [];

function ParticleClass(x, y, image) {
	this.height = this.width = 3;

	this.posOrNeg = 0;
	this.sign = function() {
		this.signCheck = Math.random();
		this.signCheck < 0.5 ? this.posOrNeg = -1; : this.posOrNeg = 1;
	}

	this.x = (x + Math.random() * (posOrNeg)9);
	this.y = y;
	this.moveTimer = 0;
	this.removeMe = false;
	this.color = image;

	const FLOATING_FACTOR = 0.01;

	this.draw = function() {
		drawImage(this.color, image.width/2, image.height/2, 1,1, 
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

function missileSpawn() {
	particleList.push(new ParticleClass());
}