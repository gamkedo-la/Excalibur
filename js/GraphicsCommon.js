
function drawBitmapCenteredAtLocationWithRotation(graphic, atX, atY,withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,-graphic.width/2,-graphic.height/2); // center, draw
  canvasContext.restore(); // undo the translation movement and rotation since save()
}

function drawAnimatedVerticalBitmapCenteredAtLocationWithRotation(graphic, frameNow, 
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

function drawAnimatedHorizontalBitmapCenteredAtLocationWithRotation(graphic, frameNow, 
                                                          graphicFrameW,graphicFrameH, 
                                                          atX, atY, withAngle) {
  canvasContext.save(); // allows us to undo translate movement and rotate spin
  canvasContext.translate(atX,atY); // sets the point where our graphic will go
  canvasContext.rotate(withAngle); // sets the rotation
  canvasContext.drawImage(graphic,
                          0, frameNow * graphicFrameH,
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

function drawStroked(text, x, y,fillColor,font,align = 'left') {
  canvasContext.font = font;
  canvasContext.strokeStyle = 'black';
  canvasContext.textAlign = align;
  canvasContext.lineWidth = 8;
  canvasContext.strokeText(text, x, y);
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(text, x, y);
}

function colorText(showWords,textX,textY,fillColor,fontface,textAlign = 'left',opacity = 1) {
  canvasContext.save();
  canvasContext.textAlign = textAlign;
  canvasContext.font = fontface;
  canvasContext.globalAlpha = opacity;
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
  canvasContext.restore();
}

function getFontWeight(font) {
  canvasContext.save();
  canvasContext.font = this.buttonFont;
  
  var weight = parseInt(font.match(/\d+/)[0]); //regex match the first string of digits
  
  canvasContext.restore();
  
  return weight;
}

function getTextWidth(txt, font) {
  canvasContext.save();
  canvasContext.font = font;
  
  var width = canvasContext.measureText(txt).width;
  
  canvasContext.restore();
  
  return width;
}

function SpriteSheetClass(sheetIn, widthIn, heightIn){
  var sheet = sheetIn;
  var width = widthIn;
  var height = heightIn;
  
  this.draw = function(col, row, atX, atY, withAngle, flippedX = false, flippedY = false) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAngle);
    canvasContext.scale(flippedX ? -1 : 1, flippedY ? -1 : 1);
    canvasContext.drawImage(sheet,
                            col * width, row * height,
                            width, height,
                            -width/2, -height/2,
                            width, height);
    canvasContext.restore();
  }
}
