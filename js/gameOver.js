function fallingAliens () {

const ALIEN_COUNT = 50
const ENEMY_PADDING = 2
var alienVelocity = 60
var img = new Image();   // image of one alien
var tripleAliens = new Image(); // image of three consecutive aliens
img.src = '/images/alien.png' // Set source path
tripleAliens.src = '/images/alien-anim.png' 	
var whichAlien = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
} //which alien
var enemies = [img,tripleAliens] //add images as they're developed
var enemiesRandom = enemies[whichAlien(0,1)]
var enemiesRandomizer = function(enemyList){
    chosenEnemy = enemyList[whichAlien(0,1)]
    return chosenEnemy
  };
var a = 0
function drawStroked(text, x, y) {
    canvasContext.font = "80px Sans-serif"
    canvasContext.strokeStyle = 'black';
    canvasContext.lineWidth = 8;
    canvasContext.strokeText(text, x, y);
    canvasContext.fillStyle = 'red';
    canvasContext.fillText(text, x, y);
}


var loadLosingScreen = function(){

clearScreen();
var loadImage = function(image) {
  

 
  chosenEnemy = enemiesRandomizer(enemies)
   if(!image) image = this;
   for(i = 0; i < ALIEN_COUNT; i++){
    canvasContext.drawImage(chosenEnemy, ((chosenEnemy.width + ENEMY_PADDING) * i) , (30 + ENEMY_PADDING) * a)
     // canvasContext.drawImage(enemiesRandom, ((enemiesRandom.width + ENEMY_PADDING) * i) , a)
      }
   a += 1
  
   
   if(a < 23){
   	setTimeout(loadImage, 200);
   		}
   	else {

      drawStroked('GAME OVER!!', canvas.width/6, canvas.height/2)
   		
   	}
   
} //loadImage



if(enemiesRandom.complete) { //check if image was already loaded by the browser
   loadImage(enemiesRandom);

} //if portion
else { 
   enemiesRandom.onload = loadImage;
} // else statement


	

} //loadLosingScreen

loadLosingScreen();
} //fallingAliens







