var shotList = [];

CannonShotClass.reloadTime = 5;

function CannonShotClass(x, y, angle) {
	// ShotClass(x, y, angle, speed)
	ShotClass.call(this, x, y, angle, 15);
	
	this.sprite = new SpriteSheetClass(shotPic, 8, 8);
	
	this.colliderLineSeg = new lineSegment();
	
	this.draw = function() {
		this.sprite.draw(0, 0, this.position.x, this.position.y, this.moveAng + Math.PI/2, false);
	};
	
	this.checkCollisions = function(list) {
		for (var i = 0; i < list.length; i++) {
			if(list[i].checkLineCollision(this.colliderLineSeg, this.position)){
				this.removeMe = true;
			}
		}
	};
};
