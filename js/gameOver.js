var highScore = 0;

function gameOverSequence() {
    const ALIEN_COUNT = 50
    const ENEMY_PADDING = 2

    this.gameOverPlaying = false;
    this.gameOverSummaryRendered = false;

    this.gameOverImages; // array set in startGameOverSequence so after load
    var endScreenFrame = 0;
    var framesBetweenRows = 4;
    var framesShowingGameOverTextBeforeReset = /*14*/ 83;
    var artHeightTopNow = 0; // top y of next row to draw
    var framesSinceGameOverShown = -1;

    this.randomGameOverImage = function() {
        var randPicIndex = Math.floor(Math.random() * this.gameOverImages.length);
        return this.gameOverImages[randPicIndex];
    };

    this.startGameOverSequence = function() {
        waveStarted = false;
        if (currentBackground == ZEBES_BACKGROUND || currentBackground == BLACK_HOLE_BACKGROUND) {
            currentBackgroundMusic.loopSong(gameOverMusic);
        } else if (currentBackground == COMPUTER_BACKGROUND) {
            currentBackgroundMusic.loopSong(gameOverCompMusic);
        } else if (currentBackground == BEACH_BACKGROUND) {
            currentBackgroundMusic.loopSong(gameOverCrystallineCoastMusic);
        } else if (currentBackground == FANTASY_BACKGROUND) {
            currentBackgroundMusic.loopSong(gameOverFantasyMusic);
        }

        // TODO: pass gameover music into currentBackgroundMusic.loopSong()
        this.gameOverImages = [singleAlienGameOver,
            tripleAliensGameOver
        ];
        endScreenFrame = 0;
        artHeightTopNow = 0;
        framesSinceGameOverShown = -1;
        this.gameOverPlaying = true;
        drawRect(0, 0, canvas.width, canvas.height, "black");
    }

    this.animateLosingScreen = function() {
        if (masterFrameDelayTick % framesBetweenRows != 0) {
            return;
        }

        // ensure the screen is black: I think we may render one
        // final game frame after startGameOverSequence() is called
        if (artHeightTopNow == 0)
            drawRect(0, 0, canvas.width, canvas.height, "black");


        if (artHeightTopNow >= canvas.height) {
            var gameOverHeadline = ""
            if (orchestratorWins) {
                gameOverHeadline = "ORCHESTRATOR WINS!!!"
            } else if (excaliburWins) {
                gameOverHeadline = "EXCALIBUR WINS!!!"
            } else if (gameRunning) {
                gameOverHeadline = "GAME OVER!!!"
            }

            if (framesSinceGameOverShown < 0) {
                drawRect(50, 50, canvas.width - 100, canvas.height - 100, "rgba(50, 50, 50, 0.8)")

                colorText(gameOverHeadline, canvas.width / 2, canvas.height / 4 - 60, "red", "50px Sans-serif", "center");

                colorText("Final Score: " + numberWithCommas(score), canvas.width / 2, canvas.height / 4 + 10, "white", "45px Sans-serif", "center");

                colorText("Shots Fired: " + shotsFired, canvas.width / 2, canvas.height / 4 + 80, "white", "30px Sans-serif", "center");
                colorText("Number Of Hits: " + shotsHit, canvas.width / 2, canvas.height / 4 + 120, "white", "30px Sans-serif", "center");
                var ratio;
                if (shotsFired == 0) {
	                ratio = 0;
                } else {
	                ratio = (shotsHit / shotsFired * 100).toFixed(1);
                }
                colorText("Hit-Miss Ratio: " + ratio + "%", canvas.width / 2, canvas.height / 4 + 160, "white", "30px Sans-serif", "center");

                colorText("Ships Destroyed: " + shotsHitShips, canvas.width / 2, canvas.height / 4 + 220, "white", "30px Sans-serif", "center");
                colorText("Aliens Killed (Parachute): " + (shotsHitAliens + shotsHitParachutes) + " (" + shotsHitParachutes + ")", canvas.width / 2, canvas.height / 4 + 260, "white", "30px Sans-serif", "center");

                const oldHighScore = localStorage.getItem("highScore");
                if ((oldHighScore === "null") || (oldHighScore == null)) {
                    localStorage.setItem("highScore", 0);
                }

                highScore = parseInt(localStorage.getItem("highScore"));

                if (score > highScore) {
                    localStorage.setItem("highScore", score);
                    highScore = score;
                }

                colorText("High Score: " + numberWithCommas(highScore), canvas.width / 2, canvas.height / 4 + 320, "white", "30px Sans-serif", "center");

                colorText("[ PRESS  ENTER  or  CLICK  MOUSE ]", canvas.width / 2, canvas.height / 4 + 380, "white", "35px arial", "center");

                framesSinceGameOverShown = framesShowingGameOverTextBeforeReset;

                this.gameOverSummaryRendered = true;
            }
        } else {
            var chosenEnemy = this.randomGameOverImage();
            for (i = 0; i < ALIEN_COUNT; i++) {
                canvasContext.drawImage(chosenEnemy, ((chosenEnemy.width + ENEMY_PADDING) * i),
                    artHeightTopNow)
            }

            artHeightTopNow += chosenEnemy.height + ENEMY_PADDING;
        }
    } // animateLosingScreen
} // gameOverSequence class