var alienPic = document.createElement("img");
var devilAlienPic = document.createElement("img");

var spaceshipLeftPic = document.createElement("img");
var spaceshipRightPic = document.createElement("img");
var gunnerShipRightPic = document.createElement("img");
var gunnerShipLeftPic = document.createElement("img");

var misslePic = document.createElement("img");

var waveShotPic = document.createElement("img");
var laserPic = document.createElement("img");
var laserPicEnding = document.createElement("img");
var shotPic = document.createElement("img");

var backgroundTitlePic = document.createElement("img");
var backgroundFarPic = document.createElement("img");
var backgroundMedPic = document.createElement("img");
var backgroundNearPic = document.createElement("img");
var computerBackgroundFarPic = document.createElement("img");
var computerBackgroundNearPic = document.createElement("img");

var shieldPowerUpPic = document.createElement("img");
var healthPowerUpPic = document.createElement("img");
var maxHealthPowerUpPic = document.createElement("img");

var tankBodyPic = document.createElement("img");
var tankCannonPic = document.createElement("img");

// used for gameOver.js sequence:
var singleAlienGameOver = document.createElement("img");
var tripleAliensGameOver = document.createElement("img");

var timeOfDayGradient = document.createElement("img");

var waveShotPicFrameW = waveShotPicFrameH = 12;
var laserPicFrameW = 1050, laserPicFrameH = 18;

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
        { varName: devilAlienPic, theFile: "devilAlien-anim.png" },
        { varName: spaceshipRightPic, theFile: "spaceshipRight-anim.png" },
        { varName: spaceshipLeftPic, theFile: "spaceshipLeft-anim.png" },
        { varName: gunnerShipRightPic, theFile: "gunner-ship-right.png" },
        { varName: gunnerShipLeftPic, theFile: "gunner-ship-left.png" },
        { varName: misslePic, theFile: "misslePlaceholder.png" },
        { varName: backgroundTitlePic, theFile: "backgroundTitle.png" },
        { varName: backgroundFarPic, theFile: "backgroundFar.png" },
        { varName: backgroundMedPic, theFile: "backgroundMed.png" },
        { varName: backgroundNearPic, theFile: "backgroundNear.png" },
        { varName: computerBackgroundFarPic, theFile: "computerBackground.png" },
        { varName: computerBackgroundNearPic, theFile: "computerForeground.png" },
        { varName: shieldPowerUpPic, theFile: "shieldPowerUp.png" },
        { varName: healthPowerUpPic, theFile: "healthPowerUp.png" },
        { varName: maxHealthPowerUpPic, theFile: "maxHealthPowerUp.png" },
        { varName: waveShotPic, theFile: "waveShot.png" },
        { varName: laserPic, theFile: "LaserVisual.png" },
        { varName: laserPicEnding, theFile: "LaserVisualEnding.png" },
        { varName: shotPic, theFile: "ShotVisual.png" },
        { varName: tankBodyPic, theFile: "tank-body.png" },
        { varName: tankCannonPic, theFile: "tank-cannon.png" },
        { varName: singleAlienGameOver, theFile: "alien.png" },
        { varName: tripleAliensGameOver, theFile: "alien-anim.png" },
        { varName: timeOfDayGradient, theFile: "time-of-day-gradient.png" },

    ];

    picsToLoad = imageList.length;

    for (var i = 0; i < imageList.length; i++) {

        beginLoadingImage(imageList[i].varName, imageList[i].theFile);

    } // end of for imageList

} // end of function loadImages