var audioFormat;

var regularShotSound = new SoundOverlapsClass("./audio/RegularShot");
var waveShotSound = new SoundOverlapsClass("./audio/WaveShot");
var shieldPowerUpSound = new SoundOverlapsClass("./audio/ShieldPowerUp");
var pauseSound = new SoundOverlapsClass("./audio/PauseSound");
var resumeSound = new SoundOverlapsClass("./audio/ResumeSound");
var explosionSound = new SoundOverlapsClass("./audio/LoudExplosion");
var zebesBackgroundMusic = "./audio/dew-drops";
var computerBackgroundMusic = "./audio/suspain"
var menuMusic = "./audio/beeblebrox";

//game over music
var gameOverMusic = "./audio/GameOverMusic";
var gameOverCompMusic = "./audio/GameOverCompLvlMusic";
//back up sound?
var endSound = new SoundOverlapsClass("./audio/EndSound");

var currentBackgroundMusic = new backgroundMusicClass();

var currentVolume = 1.0;
var previousVolume = 1.0;
var isMuted = false;
const VOLUME_INCREMENT = 0.05;

function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
        audioFormat = ".mp3";
    } else {
        audioFormat = ".ogg";
    }
}

function backgroundMusicClass() {

    let musicSound = null;
	
    this.loopSong = function(filenameWithPath) {
        setFormat(); // calling this to ensure that audioFormat is set before needed

        if (musicSound != null) {
            musicSound.pause();
            musicSound = null;
        }
        musicSound = new Audio(filenameWithPath + audioFormat);
        musicSound.loop = true;	
		this.setVolume(currentVolume);
    }

    this.pauseSound = function() {
        musicSound.pause();
    }

    this.startOrStopMusic = function() {
        if (musicSound.paused) {
            musicSound.play();
        } else {
            musicSound.pause();
        }
    }
	
	this.setVolume = function(volume) {
		musicSound.volume = volume;
		if(volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			musicSound.play();
		}
	}
}

function SoundOverlapsClass(filenameWithPath) {
    setFormat();

    var altSoundTurn = false;
    var mainSound = new Audio(filenameWithPath + audioFormat);
    var altSound = new Audio(filenameWithPath + audioFormat);

    this.play = function() {
        if (altSoundTurn) {
            altSound.currentTime = 0;
            altSound.volume = getRandomVolume() * currentVolume;
            altSound.play();
        } else {
            mainSound.currentTime = 0;
            mainSound.volume = getRandomVolume() * currentVolume;
            mainSound.play();
        }

        this.altSoundTurn = !this.altSoundTurn; //toggling between true and false
    }
}

function getRandomVolume(){
	var min = 0.5;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	if(!isMuted)
	{
		previousVolume = currentVolume;
		currentVolume = 0.0;
		currentBackgroundMusic.setVolume(currentVolume);
		isMuted = true;
	} else {
		currentVolume = previousVolume;
		currentBackgroundMusic.setVolume(currentVolume);
		isMuted = false;
	}
}

function changeVolume(amount)
{
	isMuted = false;
	currentVolume += amount;
	if(currentVolume > 1.0) {
		currentVolume = 1.0;
	} else if (currentVolume <= 0.0) {
		currentVolume = 0.0;
		isMuted = true;
	}
	currentBackgroundMusic.setVolume(currentVolume);
}

function turnVolumeUp() {
	changeVolume(VOLUME_INCREMENT);
}

function turnVolumeDown() {
	changeVolume(-VOLUME_INCREMENT);
}