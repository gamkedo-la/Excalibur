var audioFormat;

var regularShotSound = new SoundOverlapsClass("./audio/RegularShot");
var waveShotSound = new SoundOverlapsClass("./audio/WaveShot");
var LaserShotSound = new SoundOverlapsClass("./audio/LaserCannon");

var enemyLaserChargingSound = new SoundOverlapsClass("./audio/EnemyLaserCharging");
var enemyLaserFiringSound = new SoundOverlapsClass("./audio/EnemyLaserFiring");

var shieldPowerUpSound = new SoundOverlapsClass("./audio/ShieldPowerUp");
var pauseSound = new SoundOverlapsClass("./audio/PauseSound");
var resumeSound = new SoundOverlapsClass("./audio/ResumeSound");
var explosionSound = new SoundOverlapsClass("./audio/LoudExplosion");
var smartBombSound = new SoundOverlapsClass("./audio/SmartBombSound");
var zebesBackgroundMusic = "./audio/dew-drops";
var computerBackgroundMusic = "./audio/suspain";
var menuMusic = "./audio/beeblebrox";

//game over music
var gameOverMusic = "./audio/GameOverMusic";
var gameOverCompMusic = "./audio/GameOverCompLvlMusic";
var gameOverCrystallineCoastMusic = "./audio/GameOverCrystallineCoastLvl";
var gameOverFantasyMusic = "./audio/GameOverFantasyTheme";

var currentBackgroundMusic = new backgroundMusicClass();

var musicVolume = localStorage.getItem("musicVolume");
var effectsVolume = localStorage.getItem("effectsVolume");

if(musicVolume === null){
	musicVolume = 1;
}
if(effectsVolume === null){
	effectsVolume = 1;
}

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
        this.setVolume(musicVolume);
    }

    this.pauseSound = function() {
        musicSound.pause();
    }

    this.resumeSound = function() {
        musicSound.play();
    }

    this.startOrStopMusic = function() {
        if (musicSound.paused) {
            musicSound.play();
        } else {
            musicSound.pause();
        }
    }
	
	this.setVolume = function(volume) {
		// Multipliction by a boolean serves as 1 for true and 0 for false
		musicSound.volume = Math.pow(volume * !isMuted, 2);
		
		if(musicSound.volume == 0) {
			musicSound.pause();
		} else if (musicSound.paused) {
			musicSound.play();
		}
	}
}

function SoundOverlapsClass(filenameWithPath) {
    setFormat();

    var fullFilename = filenameWithPath;
		var soundIndex = 0;
    var sounds = [new Audio(fullFilename + audioFormat), new Audio(fullFilename + audioFormat)];

    this.play = function() {
				if(!sounds[soundIndex].paused) {
					sounds.splice(soundIndex, 0, new Audio(fullFilename + audioFormat));
				}
        sounds[soundIndex].currentTime = 0;
        sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
        sounds[soundIndex].play();

        soundIndex = (++soundIndex) % sounds.length;
    }
}

function getRandomVolume(){
	var min = 0.9;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	isMuted = !isMuted;
	currentBackgroundMusic.setVolume(musicVolume);
}

function setEffectsVolume(amount)
{
	effectsVolume = amount;
	if(effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
}

function setMusicVolume(amount){
	musicVolume = amount;
	if(musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	currentBackgroundMusic.setVolume(musicVolume);
}

function turnVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}
