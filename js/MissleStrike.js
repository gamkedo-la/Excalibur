var missleList = [];
var missleWidth = 15;
var missleHeight = 50;
var frameNow = 0;
var diceRoll;

function missleClass() {
    var diceRoll = Math.random()*10;
    this.missleX = diceRoll < 5 ? 20 : canvas.width - 20;
    this.missleY = -60;
    this.position = vec2.create(this.missleX,this.missleY);
    this.speed = 5;
    this.moveAng = Math.atan2(playerY - this.missleY, playerX - this.missleX);
    this.missleSpeedY = this.missleSpeedX = this.speed;
    this.velocity = vec2.create(Math.cos(this.moveAng), Math.sin(this.moveAng));
    this.velocity.x *= this.missleSpeedX;
    this.velocity.y *= this.missleSpeedY;
    this.missleHealth = 3;
    this.colliderAABB = new aabb(missleWidth / 2, missleHeight / 2);
    this.removeMe = false;
    this.isDamaged = false;
    
    //this.ang = 0;
    //var gravity = vec2.create(0, 0.04);

    /*var movingLeft = this.velocity.x < 0;
    var misslePic = (movingLeft) ? gunnerShipLeftPic : gunnerShipRightPic;*/

    this.draw = function() {
        drawBitmapCenteredAtLocationWithRotation(misslePic, 
                                                 this.position.x, this.position.y, 
                                                 this.moveAng);
        //drawRect(this.position.x,this.position.y,missleWidth,missleHeight,"Chartreuse");          
    /*canvasContext.drawImage(pic,
        frameNow * gunnerWidth, frameOffsetY,
        gunnerWidth, gunnerHeight,
        this.position.x - gunnerWidth / 2, this.position.y - gunnerHeight,
        gunnerWidth, gunnerHeight);*/

    };

    this.move = function() {
        vec2.add(this.position, this.position, this.velocity);
        this.colliderAABB.setCenter(this.position.x, this.position.y); // Synchronize AABB position with ship position
        this.colliderAABB.computeBounds();
    };

    this.edgeOfScreenDetection = function() {
        if (this.position.y + missleHeight/2 > canvas.height) {
            this.removeMe = true;
        }
        if (this.isDamaged) {
            this.missleHealth--;
            this.isDamaged = false;
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