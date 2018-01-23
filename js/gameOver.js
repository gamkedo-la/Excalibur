function gameOverSequence() {
    const ALIEN_COUNT = 50
    const ENEMY_PADDING = 2

    this.gameOverPlaying = false;

    this.gameOverImages; // array set in startGameOverSequence so after load
    var endScreenFrame = 0;
    var framesBetweenRows = 4;
    var framesShowingGameOverTextBeforeReset = /*14*/ 83;
    var artHeightTopNow = 0; // top y of next row to draw
    var framesSinceGameOverShown = -1;


    this.randomGameOverImage = function() {
      var randPicIndex = Math.floor(Math.random()*this.gameOverImages.length);
      return this.gameOverImages[randPicIndex];
    };

    this.startGameOverSequence = function() {
        // reset fireMode
        fireMode = FIREMODE_SINGLE;
        waveStarted = false;
        if(currentBackground == ZEBES_BACKGROUND){
        currentBackgroundMusic.loopSong(gameOverMusic);
        } else if (currentBackground == COMPUTER_BACKGROUND){
        currentBackgroundMusic.loopSong(gameOverCompMusic);
        } else if (currentBackground == BEACH_BACKGROUND){
        currentBackgroundMusic.loopSong(gameOverMusic);
        } else if (assaultMode) {
        currentBackgroundMusic.loopSong(gameOverMusic);
        }
        
        // TODO: pass gameover music into currentBackgroundMusic.loopSong()
        this.gameOverImages = [singleAlienGameOver,
                              tripleAliensGameOver];
        endScreenFrame = 0;
        artHeightTopNow = 0;
        framesSinceGameOverShown = -1;
        this.gameOverPlaying = true;
        drawRect(0,0,canvas.width,canvas.height,"black");
    }

    this.animateLosingScreen = function() {
      if(masterFrameDelayTick % framesBetweenRows != 0) {
        return;
      }
    

      if (artHeightTopNow >= canvas.height) {
        if(framesSinceGameOverShown<0) {
          drawRect(50, 50, canvas.width - 100, canvas.height - 100, "rgba(50, 50, 50, 0.8)")
            
          drawStroked("GAME OVER!!", canvas.width / 2, canvas.height / 4 - 60, "red", "50px Sans-serif", "center")
          drawStroked("Final Score :" + numberWithCommas(score), canvas.width / 2, canvas.height / 4 + 10, "white", "45px Sans-serif", "center");

          drawStroked("Shots Fired: " + shotsFired, canvas.width / 2, canvas.height / 4 + 80, "white", "30px Sans-serif", "center");
          drawStroked("Number Of Hits: " + shotsHit, canvas.width / 2, canvas.height / 4 + 120, "white", "30px Sans-serif", "center");
          drawStroked("Hit-Miss Ratio: " + (shotsHit / shotsFired * 100).toFixed(1) + "%", canvas.width / 2, canvas.height / 4 + 160, "white", "30px Sans-serif", "center");

          drawStroked("Ships Destroyed: " + shotsHitShips, canvas.width / 2, canvas.height / 4 + 220, "white", "30px Sans-serif", "center");
          drawStroked("Aliens Killed (Parachute): " + (shotsHitAliens + shotsHitParachutes) + " (" + shotsHitParachutes + ")", canvas.width / 2, canvas.height / 4 + 260, "white", "30px Sans-serif", "center");

          drawStroked("[ PRESS  ENTER  or  CLICK  MOUSE ]", canvas.width / 2, canvas.height / 4 + 380, "white", "35px arial", "center");

          framesSinceGameOverShown = framesShowingGameOverTextBeforeReset;
        } /*else if(framesSinceGameOverShown-- == 0) {
          this.gameOverPlaying = false;
          resetGame();
        }*/
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