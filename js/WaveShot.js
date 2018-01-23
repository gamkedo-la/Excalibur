WaveShotClass.reloadTime = 17;
WaveShotClass.startLeft = true;

function WaveShotClass(x, y, angle) {
	// ShotClass(x, y, angle, speed)
	ShotClass.call(this, x, y, angle, 10);
	
	this.perpVector = vec2.create(this.velocity.y, -this.velocity.x);
	this.tempVec = vec2.create(this.velocity.y, -this.velocity.x);
	vec2.normalize(this.perpVector, this.perpVector);
	
	this.waveIncrement = 0;
	this.waveFreq = 0.3;
	this.waveMagnitide = 8;
	
	// Alternate between wave directions
	this.waveMagnitide *= WaveShotClass.startLeft ? 1 : -1;
	WaveShotClass.startLeft = !WaveShotClass.startLeft;
	
	this.frameNow = 0;

	this.sprite = new SpriteSheetClass(waveShotPic, 12, 12);
	
	this.colliderLineSeg = new lineSegment();
	
	this.draw = function () {
		if (masterFrameDelayTick % 16 == 0) {
			this.frameNow = 0;
		} else if (masterFrameDelayTick % 16 == 2) {
			this.frameNow = 1;
		} else if (masterFrameDelayTick % 16 == 4){
			this.frameNow = 2;
		} else if (masterFrameDelayTick % 16 == 8) {
			this.frameNow = 3;
		}
		
		this.sprite.draw(this.frameNow, 0, this.position.x, this.position.y, this.moveAng)
	};

	this.parentMove = this.move;
	this.move = function () {
		this.parentMove();
		
		this.waveIncrement += this.waveFreq;
		vec2.scale(this.tempVec, this.perpVector, Math.cos(this.waveIncrement) * this.waveMagnitide);
		vec2.add(this.position, this.position, this.tempVec);
	};

	this.checkBounds = function() {
		// note: not checking screen bottom since we can't shoot down
		if (this.position.x < -this.waveMagnitide || this.position.x > canvas.width + this.waveMagnitide || this.position.y < 0) {
			this.removeMe = true;
		}
	};
};
