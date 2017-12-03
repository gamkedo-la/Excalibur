function gameOverSequence() {
    const ALIEN_COUNT = 50
    const ENEMY_PADDING = 2

    this.gameOverPlaying = false;

    this.gameOverImages; // array set in startGameOverSequence so after load
    var endScreenFrame = 0;
    var framesBetweenRows = 4;
    var framesShowingGameOverTextBeforeReset = 15;
    var artHeightTopNow = 0; // top y of next row to draw
    var framesSinceGameOverShown = -1;

    this.randomGameOverImage = function() {
      var randPicIndex = Math.floor(Math.random()*this.gameOverImages.length);
      return this.gameOverImages[randPicIndex];
    };

    this.startGameOverSequence = function() {
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
          drawStroked('GAME OVER!!', canvas.width / 6, canvas.height / 2)
          framesSinceGameOverShown = framesShowingGameOverTextBeforeReset;
        } else if(framesSinceGameOverShown-- == 0) {
          this.gameOverPlaying = false;
          resetGame();
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