var debug = false;
var gameRunning = false;

const scoreForAlienShot = 50;
const scoreForParachuteShot = 75;
var score = 0;

var currentBackgroundFar = backgroundFarPic;
var currentBackgroundMed = backgroundTitlePic;
var currentBackgroundNear = backgroundNearPic;

var gameOverManager = new gameOverSequence();

var gameUpdate;
var gameDropshipSpawn;
var gameGunshipSpawn;
var gameProtectorSpawn;
var gameMissileSpawn;

var masterFrameDelayTick = 0;
var canvas, canvasContext;
currentBackgroundMusic.loopSong(menuMusic);

var timeStarted;
var timeStartedActive;
var timeElapsedInSeconds = 0;
var frameCount = 0;

window.onload = function() {
    window.addEventListener("focus", windowOnFocus);
    window.addEventListener("blur", windowOnBlur);

    canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.width = 800;
    canvas.height = 600;
    drawRect(0, 0, canvas.width, canvas.height, "black");
    colorText('LOADING...', canvas.width / 2, canvas.height / 2, "white", "30px Tahoma", "center", 1);

    TitleTextX = canvas.width;
    subTitleTextX = 0;
    opacity = 0;

    playerX = canvas.width / 2;
    playerY = canvas.height - playerHeight / 2;
    playerY + playerHeight / 2;

    initializeInput();
    loadImages();
    initExplosions();
    mainMenu.initialize();
    initializeEnemyClasses();
    initializeShotClasses();
};

function loadingDoneSoStartGame() {
    gameUpdate = setInterval(update, 1000 / 30);
}

function update() {
    if (!gameRunning) {
        mainMenuStates();
    } else {
        if (!gameOverManager.gameOverPlaying) {
            drawScrollingBackground();
            handleInput();
            moveAll();
        }
        drawAll();
        if (smartBombActive) {
            //Destroy all ships
            for (var ship of shipList) {
                ship.removeMe = true;
            }
            //Destroy all aliens
            for (var alien of alienList) {
                alien.removeMe = true;
            }
            smartBombActive = false;
        }
        if (!twoPlayerMode && !carnageMode) {
            waveControllerStart();
        } else if (twoPlayerMode) {
            orchestratorFrameCount();
        } else if (carnageMode) {
            carnageModeController();
        }
    }
}

function drawAll() {
    masterFrameDelayTick++;
    if (gameOverManager.gameOverPlaying) {
        gameOverManager.animateLosingScreen();
        return;
    }
    drawAndRemoveShips();
    drawAndRemoveMissiles();
    drawAndRemoveAliens();
    drawAndRemoveShots();
    drawPlayer();
    drawAndRemoveParticles();
    drawAndRemovePowerUps();
    drawScoreAndBombAmmo();
    if (carnageMode || orchestratorMode) {
        return;
    } else {
        drawLives();
    }
    drawExplosions();

    frameCount++;

    timeElapsedInSeconds = timeElapsedInSeconds + (new Date().getTime() - timeStartedActive) / 1000;
    timeStartedActive = new Date().getTime();
}

function moveAll() {
    moveShips();
    moveMissiles();
    moveAliens();
    moveShots();
    moveParticles();
    movePowerUps();
    updateExplosions();
}

// optimization todo: support wider background wrap but draw only on-screen portion
function wrappedDraw(whichImg, pixelOffset) {
    var wrappedOffset = Math.floor(pixelOffset % whichImg.width);
    canvasContext.drawImage(whichImg, 0, 0,
        whichImg.width - wrappedOffset, whichImg.height,
        wrappedOffset, 0,
        whichImg.width - wrappedOffset, whichImg.height);
    var drawSize = (whichImg.width - wrappedOffset);
    if (drawSize < whichImg.width) { // avoids Firefox issue on 0 image dim
        canvasContext.drawImage(whichImg, drawSize, 0,
            wrappedOffset, whichImg.height,
            0, 0,
            wrappedOffset, whichImg.height);
    }
}

// background sky (with time of day simulation gradient)
// scrolls through a super zoomed in lookup table (gradient texture)
function drawSkyGradient() {
    canvasContext.drawImage(
        timeOfDayGradient,
        (Math.floor(masterFrameDelayTick * 0.2) % timeOfDayGradient.width), 0, 1, 100, // source x,y,w,d (scroll source x over time)
        0, 0, 800, 600); // dest x,y,w,d (scale one pixel worth of the gradient to fill entire screen)
}

function drawScrollingBackground() {

    drawSkyGradient();

    var backgroundFarOffset = 0.15;
    var backgroundMedOffset = 0.6;
    var backgroundNearOffset = 4.6;

    // don't move the background for now if we're dealing with the black hole
    if (currentBackground == BLACK_HOLE_BACKGROUND) {
        backgroundFarOffset = 0;
        backgroundMedOffset = 0;
        backgroundNearOffset = 0;
    } else if (blackHoleIsActive) {
        blackHoleIsActive = false;
        debrisList = [];
    }

    // background terrain
    wrappedDraw(currentBackgroundFar, masterFrameDelayTick * backgroundFarOffset);
    wrappedDraw(currentBackgroundMed, masterFrameDelayTick * backgroundMedOffset);
    wrappedDraw(currentBackgroundNear, masterFrameDelayTick * backgroundNearOffset);

    // checked again so that the other items for 
    // the black hole are drawn after the background
    if (currentBackground == BLACK_HOLE_BACKGROUND) {
        updateBlackHole();
    }
}

function startGame() {
    windowState.help = false;
    windowState.mainMenu = false;

    changeBackground(currentStageIndex);

    timeStarted = new Date().getTime();
    timeStartedActive = timeStarted;
    timeElapsedInSeconds = 0;
    frameCount = 0;
    shotsFired = 0;
    shotsHit = 0;
    shotsHitShips = 0;
    shotsHitAliens = 0;
    shotsHitParachutes = 0;
    shipsTotal = 0;
    gunShipsTotal = 0;
    dropShipsTotal = 0;
    gameRunning = true;
}