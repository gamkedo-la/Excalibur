var alienPic = document.createElement("img");
var spaceshipLeftPic = document.createElement("img");
var spaceshipRightPic = document.createElement("img");
var gunnerShipRightPic = document.createElement("img");
var gunnerShipLeftPic = document.createElement("img");

var waveShotPic = document.createElement("img");
var shotPic = document.createElement("img");

var backgroundFarPic = document.createElement("img");
var backgroundMedPic = document.createElement("img");
var backgroundNearPic = document.createElement("img");

var shieldPowerUpPic = document.createElement("img");
var healthPowerUpPic = document.createElement("img");
var maxHealthPowerUpPic = document.createElement("img");

var tankBodyPic = document.createElement("img");
var tankCannonPic = document.createElement("img");




var alienPicFrameW = 43;
var alienPicFrameH = 27;
var waveShotPicFrameW = waveShotPicFrameH = 12;

var spaceshipPicFrameW = 100;
var spaceshipPicFrameH = 32;

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad--;
    if (picsToLoad == 0) { // last image loaded?
        loadingDoneSoStartGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload = countLoadedImageAndLaunchIfReady;
    imgVar.src = "images/" + fileName;
}

function loadImages() {
    var imageList = [
        { varName: alienPic, theFile: "alien-anim.png" },
        { varName: spaceshipRightPic, theFile: "spaceshipRight-anim.png" },
        { varName: spaceshipLeftPic, theFile: "spaceshipLeft-anim.png" },
        { varName: gunnerShipRightPic, theFile: "gunner-ship-right.png" },
        { varName: gunnerShipLeftPic, theFile: "gunner-ship-left.png" },
        { varName: backgroundFarPic, theFile: "backgroundFar.png" },
        { varName: backgroundMedPic, theFile: "backgroundMed.png" },
        { varName: backgroundNearPic, theFile: "backgroundNear.png" },
        { varName: shieldPowerUpPic, theFile: "shieldPowerUp.png" },
        { varName: healthPowerUpPic, theFile: "healthPowerUp.png" },
        { varName: maxHealthPowerUpPic, theFile: "maxHealthPowerUp.png" },
        { varName: waveShotPic, theFile: "waveShot.png" },
        { varName: shotPic, theFile: "ShotVisual.png" },
        { varName: tankBodyPic, theFile: "tank-body.png" },
        { varName: tankCannonPic, theFile: "tank-cannon.png" },


    ];

    picsToLoad = imageList.length;

    for (var i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].varName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages