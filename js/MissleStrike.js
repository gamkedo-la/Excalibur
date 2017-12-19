var missleList = [];
var missleWidth = 15;
var missleHeight = 50;
var frameNow = 0;
var diceRoll;

function missleClass() {
    random1To10();
    var missleX = diceRoll < 5 ? 0 - 60 : canvas.width + 60;
    var missleY = -60;
    this.position = vec2.create(missleX,missleY);
    this.moveAng = Math.atan2(playerY - this.position.y, playerX - this.position.x);
    //this.missleSpeedX;
    this.missleSpeedY = 6;
    if (missleX == -50) {
        this.missleSpeedX = 6;
    } else {
        this.missleSpeedX = -6;
    }
    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    this.missleHealth = 3;
    this.colliderAABB = new aabb(missleWidth / 2, missleHeight / 2);
    this.removeMe = false;
    this.isDamaged = false;
    
    //this.ang = 0;
    //var gravity = vec2.create(0, 0.04);

    var movingLeft = this.velocity.x < 0;

    var misslePic = (movingLeft) ? gunnerShipLeftPic : gunnerShipRightPic;

    this.draw = function() {
        drawRect(this.position.x,this.position.y,missleWidth,missleHeight,"Chartreuse")          
    /*canvasContext.drawImage(pic,
        frameNow * gunnerWidth, frameOffsetY,
        gunnerWidth, gunnerHeight,
        this.position.x - gunnerWidth / 2, this.position.y - gunnerHeight,
        gunnerWidth, gunnerHeight);*/

    };

    this.move = function() {
        this.position.x += this.missleSpeedX * this.velocity.x;
        this.position.y += this.missleSpeedY * this.velocity.y;
        this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with ship position
        this.colliderAABB.computeBounds();
    };

    this.edgeOfScreenDetection = function() {
        if (missleY == canvas.height) {
            this.removeMe = true;
        }
        if (this.isDamaged = true) {
            this.isDamaged = false;
            this.missleHealth--;
        } 
        if (this.missleHealth == 0) {
            this.removeMe = true;
        }
    };
};

function drawAndRemoveMissles() {
    for(var i=0;i<missleList.length;i++) {
        missleList[i].draw();
    }
    for(var i=missleList.length-1;i>=0;i--) {
        if(missleList[i].removeMe) {
            missleList.splice(i,1);
        }
    }
};

function moveMissles() {
    for(var i=0;i<missleList.length;i++) {
        missleList[i].move();
        missleList[i].edgeOfScreenDetection();
    }
};

function missleSpawn() {
    var newMissle = new missleClass();
    missleList.push(newMissle);
}

function random1To10() {
    diceRoll = Math.random()*10;
}