// Anchor positions are from center of top button
mainMenu = {
	titleFont: "40px Tahoma",
  buttonFont: "20px Tahoma",

	fontOverhangRatio: 4/5, // Currently 4/5 is correct for "Tahoma" font. Change if font changes
	
	//Must initialize these after the canvas has been set up
	buttonProperties: {},
	buttons: [],
	sliders: [],
	
	initialize: function() {
		this.buttonProperties = {
			padding: 4,
			anchorX: canvas.width/2  - 5,
			anchorY: canvas.height/2  + 70,
			verticalSpacing: 2,
		};
		
		// Buttons are also given a "bounds" property further down
		this.buttons = [
			{
				txt: "[H] for Help",
				onClick: openHelp,
			},
			{
				txt: "[Enter] to Play",
				onClick: startGame,
			},
			{
				txt : "[T] for Two Player Mode",
				onClick : startOrchestratorMode,
			},
		];
		
		this.sliders = [
			new function(){
				this.txt = "Music Volume";
				this.spacing = 5;
				
				this.width = 200;
				this.height = 10;
				this.x = canvas.width/2  - 5 - this.width/2;
				this.y = canvas.height/2  + 180 - this.height/2;
				
				this.handleWidth = 30;
				this.handleHeight = 30;
				this.handlePosition = musicVolume;
				this.handleY = this.y - this.handleHeight/2 + this.height/2;
				this.getHandleX = function() {
					return this.x + this.handlePosition * (this.width - this.handleWidth);
				};
				
				this.active = false;
				this.onSlide = function(volume){
					setMusicVolume(volume);
					localStorage.setItem("musicVolume", musicVolume);
				}
			},
			new function(){
				this.txt = "Effects Volume";
				this.spacing = 5;
				
				this.width = 200;
				this.height = 10;
				this.x = canvas.width/2  - 5 - this.width/2;
				this.y = canvas.height/2  + 240 - this.height/2;
				
				this.handleWidth = 30;
				this.handleHeight = 30;
				this.handlePosition = effectsVolume;
				this.handleY = this.y - this.handleHeight/2 + this.height/2;
				this.getHandleX = function() {
					return this.x + this.handlePosition * (this.width - this.handleWidth);
				};
				
				this.active = false;
				this.onSlide = function(volume){
					setEffectsVolume(volume);
					localStorage.setItem("effectsVolume", effectsVolume);
				}
			},
		]
		this.setButtonBounds();
	},
	
	// Size the buttons based on the text length and font size
	setButtonBounds: function(){
		var prop = this.buttonProperties;
		var height = getFontWeight(this.buttonFont) + prop.padding * 2; // Height is the same for all buttons
		
		for(var i = 0; i < this.buttons.length; i++) {
			var bounds = {};
			
			bounds.width = getTextWidth(this.buttons[i].txt, this.buttonFont) + prop.padding * 2;
			bounds.height = height;
			
			bounds.x = prop.anchorX - (bounds.width/2);
			bounds.y = prop.anchorY - (height * this.fontOverhangRatio) + ((height + prop.verticalSpacing) * i);
			
			this.buttons[i].bounds = bounds;
		}
	},
	
	checkButtons: function() {
		for(var i = 0; i < this.buttons.length; i++){
			var bounds = this.buttons[i].bounds;
			if(mouseInside(bounds.x, bounds.y, bounds.width, bounds.height)) {
				this.buttons[i].onClick();
			}
		}
		
		var sliders = this.sliders;
		
		for(var i = 0; i < sliders.length; i++){
			if(mouseInside(sliders[i].getHandleX(), sliders[i].handleY, sliders[i].handleWidth, sliders[i].handleHeight)) {
				sliders[i].active = true;
			}
		}
	},
	
	handleSliders: function() {
		sliders = this.sliders;
		for(i = 0; i < sliders.length; i++) {
			if(sliders[i].active) {
				var handleX = mouseX - sliders[i].handleWidth/2;
				
				handleX = clamp(handleX, sliders[i].x, sliders[i].x + sliders[i].width - sliders[i].handleWidth);
				
				sliders[i].handlePosition = (handleX - sliders[i].x)/(sliders[i].width - sliders[i].handleWidth);
				sliders[i].onSlide(sliders[i].handlePosition);
			}
		}
	},
	
	releaseSliders: function() {
		for(i = 0; i < this.sliders.length; i++) {
			if(this.sliders[i].txt === "Effects Volume" && this.sliders[i].active) {
				regularShotSound.play();
			}
			this.sliders[i].active = false;
		}
	},
	
	drawButtons: function(opacity) {
		var prop = this.buttonProperties;
		
		for (var i = 0; i < this.buttons.length; i++) {
			var bounds = this.buttons[i].bounds;
			
			var fontOverhangAdjustment = (bounds.height - prop.padding * 2) * this.fontOverhangRatio;
			var posX = bounds.x + prop.padding;
			var posY = bounds.y + prop.padding + fontOverhangAdjustment;
			
			colorText(this.buttons[i].txt, posX, posY, "white", this.buttonFont, "left", opacity);
			
			if(debug) { // draw bounds for buttons in semi-transparent colors
				var colors = ["red", "green", "blue", "aqua", "fuchaia", "yellow"];
				
				var tempAlpha = canvasContext.globalAlpha;
				canvasContext.globalAlpha = 0.2;
				
				drawRect(bounds.x, bounds.y, bounds.width, bounds.height, colors[i]);
				
				canvasContext.globalAlpha = tempAlpha;
			}
		}
		
		var sliders = this.sliders;
		for(var i = 0; i < sliders.length; i++) {
			drawRect(sliders[i].x, sliders[i].y, sliders[i].width, sliders[i].height, "yellow");
			drawRect(sliders[i].getHandleX(), sliders[i].handleY, sliders[i].handleWidth, sliders[i].handleHeight, "purple");
			
			var txtX = sliders[i].x + sliders[i].width/2;
			var txtY = sliders[i].y - getFontWeight(this.buttonFont) + sliders[i].spacing;
			colorText(sliders[i].txt, txtX, txtY, "white", this.buttonFont, "center", opacity);
		}
	},
};

var clamp = function(n, min, max) {
  return Math.min(Math.max(n, min), max);
};
