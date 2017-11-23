var audioFormat;

var regularShotSound = new SoundOverlapsClass("/Users/levi-annminer/Desktop/TW Stuff/Games in Development/Excalibur/audio/RegularShot");

function playRegularShotSound() {
	regularShotSound.play();
}

function setFormat() {
	var audio = new Audio();
	if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
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
