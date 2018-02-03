const debris = {
    ship: {
        image: blackHoleDebris1,
        speed: 0.9
    },
    bigRock: {
        image: blackHoleDebris2,
        speed: 0.5
    },
    mediumRock: {
        image: blackHoleDebris3,
        speed: 0.75
    },
    smallRock: {
        image: blackHoleDebris4,
        speed: 1
    }
};
const debrisTypes = Object.keys(debris);
const MAX_DEBRIS_ON_SCREEN = 7;
const BLACK_HOLE_RADIUS = 80;

var debrisList = [];
var blackHoleAngle = 0;

var blackHoleIsActive = false;

function updateBlackHole() {
    if (!blackHoleIsActive) {
        blackHoleAngle = 0;
        blackHoleIsActive = true;
    }

    rotateBlackHole();
    moveDebrisTowardBlackHole();
    drawAndRemoveDebris();
}

function rotateBlackHole() {
    const TURN_RATE = 0.004;
    blackHoleAngle += TURN_RATE;

    canvasContext.save();
    canvasContext.translate(canvas.width / 2, canvas.height / 2);
    canvasContext.rotate(blackHoleAngle + Math.PI / 2);
    canvasContext.drawImage(blackHoleRotatingBG, -canvas.width / 2, -canvas.height / 2);
    canvasContext.restore();
}

function createDebrisOffScreen() {
    while (debrisList.length < MAX_DEBRIS_ON_SCREEN) {
        var randomIndex = getRandomNumber(0, debrisTypes.length - 1);
        var debrisType = debrisTypes[randomIndex];

        // clone the object by assigning its properties to another
        var pieceOfDebris = Object.assign({}, debris[debrisType]);

        pieceOfDebris.position = getOffScreenPosition();

        debrisList.push(pieceOfDebris);
    }
}

function getOffScreenPosition() {
    const maxY = 610;
    const minY = -20;

    const maxX = 810;
    const minX = -20;

    var newPosition = {
        x: getRandomNumber(minX, maxX),
        y: getRandomNumber(minY, maxY)
    }

    while (positionIsVisible(newPosition)) {
        newPosition = {
            x: getRandomNumber(minX, maxX),
            y: getRandomNumber(minY, maxY)
        }
    }

    return newPosition;
}

function positionIsVisible(position) {
    return (
        position.x <= canvas.width &&
        position.x >= 0 &&
        position.y <= canvas.height &&
        position.y >= 0
    );
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function moveDebrisTowardBlackHole() {
    if (debrisList.length < MAX_DEBRIS_ON_SCREEN) {
        createDebrisOffScreen();
    }

    for (var i = 0; i < debrisList.length; i++) {
        var position = debrisList[i].position;
        var speed = debrisList[i].speed;
        var targetX = canvas.width / 2;
        var targetY = canvas.height / 2;

        var distanceX = targetX - position.x;
        var distanceY = targetY - position.y;
        var distanceFromTarget = Math.sqrt((distanceX ** 2) + (distanceY ** 2));

        var velocityX = (distanceX / distanceFromTarget) * speed;
        var velocityY = (distanceY / distanceFromTarget) * speed;

        if (Math.abs(distanceX) >= 1) {
            position.x += velocityX;
        }
        if(Math.abs(distanceY) >= 1) {
            position.y += velocityY;
        }

        // canvasContext.beginPath();
        // canvasContext.fillStyle = 'yellow'
        // canvasContext.arc(targetX, targetY, BLACK_HOLE_RADIUS, 0, 2 * Math.PI);
        // canvasContext.stroke();

        if (distanceFromTarget <= BLACK_HOLE_RADIUS) {
            // console.log("REMOVING", JSON.stringify(debrisList[i], null, 4))
            // console.log("DISTANCE FROM TARGET", distanceFromTarget)
            debrisList[i].remove = true;
        }
    }
}

function drawAndRemoveDebris() {
    const imageSize = 0.20

    for (var i = 0; i < debrisList.length; i++) {
        var image = debrisList[i].image;
        var x = debrisList[i].position.x - image.width / 2;
        var y = debrisList[i].position.y - image.height / 2;
        canvasContext.drawImage(image, x, y, image.width * imageSize, image.height * imageSize);
    }

    var i = debrisList.length;
    while (i--) {
        if (debrisList[i].remove) {
            debrisList.splice(i, 1);
        }
    }
}