
function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function drawAnimatedBitmapCenteredAtLocationWithRotation(graphic, frameNow, 
                                                          graphicFrameW,graphicFrameH, 
                                                          atX, atY, withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,
                          frameNow * graphicFrameW, 0,
                          graphicFrameW, graphicFrameH,
                          -graphicFrameW/2,-graphicFrameH/2, 
                          graphicFrameW, graphicFrameH); // center, animate, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

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

function drawRect(x,y,w,h,color) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,w,h);
}

function drawStroked(text, x, y) {
  canvasContext.font = "80px Sans-serif"
  canvasContext.strokeStyle = 'black';
  canvasContext.lineWidth = 8;
  canvasContext.strokeText(text, x, y);
  canvasContext.fillStyle = 'red';
  canvasContext.fillText(text, x, y);
}