
function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

// Moved to GraphicsCommon.js - Terrence.
//flip sprite to face mouse or player
function drawBitmapFlipped(graphic, atX, atY, flipToFaceLeft) {
		canvasContext.save();
  		canvasContext.translate(atX, atY);
		if(flipToFaceLeft) {
			canvasContext.scale(-1.0,1.0);
		}
		canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2);
		canvasContext.restore();
}