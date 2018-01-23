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
          drawStroked("GAME OVER!!", canvas.width / 6, canvas.height / 4, "red", "80px Sans-serif")
          drawStroked("Final Score :" + score, canvas.width / 2, canvas.height / 4 + 80, "white", "60px Sans-serif", "center");
          drawStroked("[ P R E S S  E N T E R  or  C L I C K  M O U S E ]", canvas.width / 2, canvas.height / 4 + 140, "white", "30px arial", "center");

          drawStroked("Shots Fired: "+ shotsFired, canvas.width / 2, canvas.height / 4 + 260, "white", "30px Sans-serif", "center");
          drawStroked("Number Of Hits: "+ shotsHit, canvas.width / 2, canvas.height / 4 + 320, "white", "30px Sans-serif", "center");
          drawStroked("Hit-Miss Ratio: "+ (shotsHit / shotsFired * 100).toFixed(1) + "%", canvas.width / 2, canvas.height / 4 + 380, "white", "30px Sans-serif", "center");

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