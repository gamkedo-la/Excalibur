var missileList = [];
var delayInMilliseconds = 150;
var explosionScale = 3; // 3 because of scaling from missileCollisionExplosion() in Explosions.js 

function MissileClass() {
  var screenEdgeBuffer = 20;
  this.position = vec2.create(Math.random() * (canvas.width - screenEdgeBuffer * 2) + screenEdgeBuffer,
	                            -60);
	
	//EnemyClass(width, height, speed, angle, health)
	EnemyClass.call(this, 31, 10, 5, Math.atan2(playerY - this.position.y, playerX - this.position.x), 3);
	
	this.explosion = function(x, y) {
		missileHitExplosion(x, y, 0.5);
	};

	this.score = 20;
	this.numFrames = 2;
	this.ticksPerFrame = 5;
	var frameRow = 0;
		
	var sprite = new SpriteSheetClass(missilePic, this.width, this.height);

	this.draw = function() {
		sprite.draw(Math.floor(this.tickCount / this.ticksPerFrame), frameRow, this.position.x, this.position.y, this.ang, false);
	};

	this.parentMove = this.move;
	this.move = function() {
		damageSmokeExplosion(this.position.x,this.position.y);
		this.parentMove();
	};

	this.edgeOfScreenDetection = function() {
		if (this.position.y + this.height/2 > canvas.height) {
			missileList.push(new missileExplosionClass(this.position));
			this.removeMe = true;
		}
	};
	
	this.parentCheckLineCollision = this.checkLineCollision;
	this.checkLineCollision = function(lineSegment, projectilePos) {
		var hit = this.parentCheckLineCollision(lineSegment, this.position);
		
		if(hit) {
			if(this.health === 1) {
				this.explosion = shipHitExplosion;
			}
			else if(this.health === 0) {
				this.removeMe = true;
			}
		}
		
		return hit;
  };
}

function missileExplosionClass(initPos) {
    this.position = initPos;
    this.missileExplosionLowerRight = vec2.create(this.position.x + (explosion_w/2) * explosionScale,
                            this.position.y + (explosion_h/2) * explosionScale);
    this.missileExplosionTopLeft = vec2.create(this.position.x - (explosion_w/2) * explosionScale,
                          this.position.y - (explosion_h * explosionScale));
    this.colliderAABB = new aabb(explosion_w / 2, explosion_h / 2);
    this.removeMe = false;

    this.draw = function() {
        missileCollisionExplosion(this.position.x,this.position.y);
        explosionSound.play();
    };

    this.move = function() {
       if (!boundariesNotOverlapping(playerTopLeft, playerLowerRight,
                                     this.missileExplosionTopLeft,this.missileExplosionLowerRight) 
           && !shieldActive) {
            setTimeout(function() {
                hitPlayer();
            }, delayInMilliseconds);
       }
			 this.edgeOfScreenDetection();
    };

    this.edgeOfScreenDetection = function() {
        if (!missileCollisionExplosion()) {
            this.removeMe = true;
				}
    };
		
		// TODO maybe take explosions off the missile list so this function isn't needed
    this.checkLineCollision = function(lineSegment, projectilePos) {};
}

function drawAndRemoveMissiles() {
    for(var i=0;i<missileList.length;i++) {
        missileList[i].draw();
    }
    for(var i=missileList.length-1;i>=0;i--) {
        if(missileList[i].removeMe) {
            missileList.splice(i,1);
        }
    }
}

function moveMissiles() {
    for(var i=0;i<missileList.length;i++) {
        missileList[i].move();
    }
}

function missileSpawn() {
    missileList.push(new MissileClass());
}
