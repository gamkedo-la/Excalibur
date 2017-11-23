var audioFormat;

var regularShotSound = new SoundOverlapsClass("./audio/RegularShot");
var backgroundSound = new backgroundMusicClass("./audio/beeblebrox");
backgroundSound.loopSong();


function setFormat() {
	var audio = new Audio();
	if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
	}
}

function backgroundMusicClass(filenameWithPath){

  let musicSound = null;
    
  this.loopSong = function() {
    setFormat(); // calling this to ensure that audioFormat is set before needed
    
    if(musicSound != null) {
      musicSound.pause();
      musicSound = null;
    }
    musicSound = new Audio(filenameWithPath+audioFormat);
    musicSound.loop = true;
    musicSound.play();
  }
  
  this.startOrStopMusic = function() {
    if(musicSound.paused) {
      musicSound.play();
    } else {
      musicSound.pause();
    }
  }
}

function SoundOverlapsClass(filenameWithPath) {
		setFormat();

		var altSoundTurn = false;
		var mainSound = new Audio(filenameWithPath+audioFormat);
		var altSound = new Audio(filenameWithPath+audioFormat);

	this.play = function() {
	if (altSoundTurn) {
		altSound.currentTime = 0 ;
		altSound.play();
	} else {
		mainSound.currentTime = 0 ;
		mainSound.play();
	}

	   this.altSoundTurn = !this.altSoundTurn; //toggling between true and false
	}
}
