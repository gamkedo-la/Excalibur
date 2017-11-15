var alienPic=document.createElement("img");
var spaceshipLeftPic=document.createElement("img");
var spaceshipRightPic=document.createElement("img");
var gunnerShipRightPic=document.createElement("img");
var gunnerShipLeftPic=document.createElement("img");



var alienPicFrameW = 43;
var alienPicFrameH = 27;

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
  picsToLoad--;
  if(picsToLoad == 0) { // last image loaded?
    loadingDoneSoStartGame();
  }
}

function beginLoadingImage(imgVar, fileName) {
  imgVar.onload=countLoadedImageAndLaunchIfReady;
  imgVar.src="images/"+fileName;
}

function loadImages() {

  var imageList = [
    {varName:alienPic, theFile:"alien-anim.png"},
    {varName:spaceshipRightPic, theFile:"spaceshipRight.png"},
    {varName:spaceshipLeftPic, theFile:"spaceshipLeft.png"},
    {varName:gunnerShipRightPic, theFile:"gunner-ship-right.png"},
    {varName:gunnerShipLeftPic, theFile:"gunner-ship-left.png"},

  ];

  picsToLoad = imageList.length;

  for(var i=0;i<imageList.length;i++) {
    
      beginLoadingImage(imageList[i].varName, imageList[i].theFile);
   
  } // end of for imageList

} // end of function loadImages
