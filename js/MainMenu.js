// Anchor positions are from center of top button
mainMenu = {
	titleFont: "40px Tahoma",
  buttonFont: "20px Tahoma",

	fontOverhangRatio: 4/5, // Currently 4/5 is correct for "Tahoma" font. Change if font changes
	
	//Must initialize these after the canvas has been set up
	buttonProperties: {},
	buttons: [],
	volumeSlider: {},
	
	volumeSliderActive: false,
	
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
				txt : "[O] for Orchestrator Mode",
				onClick : startOrchestratorMode,
			},
		];
		
		this.volumeSlider = new function(){
			this.txt = "Master Volume";
			this.spacing = 5;
			
			this.width = 200;
			this.height = 10;
			this.x = canvas.width/2  - 5 - this.width/2;
			this.y = canvas.height/2  + 180 - this.height/2;
			
			this.handleWidth = 30;
			this.handleHeight = 30;
			this.handlePosition = currentVolume;
			this.handleY = this.y - this.handleHeight/2 + this.height/2;
			this.getHandleX = function() {
				return this.x + this.handlePosition * (this.width - this.handleWidth);
			};
		};
		
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
		
		var slider = this.volumeSlider;
		
		if(mouseInside(slider.getHandleX(), slider.handleY, slider.handleWidth, slider.handleHeight)) {
			this.volumeSliderActive = true;
		}
	},
	
	handleSliders: function() {
		if(this.volumeSliderActive) {
			var slider = this.volumeSlider;
			
			var handleX = mouseX - slider.handleWidth/2;
			
			handleX = clamp(handleX, slider.x, slider.x + slider.width - slider.handleWidth);
			setVolume((handleX - slider.x)/(slider.width - slider.handleWidth));
			this.volumeSlider.handlePosition = currentVolume;
			
			localStorage.setItem("masterVolume", currentVolume);
		}
	},
	
	releaseSliders: function() {
		this.volumeSliderActive = false;
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
		
		var slider = this.volumeSlider;
		drawRect(slider.x, slider.y, slider.width, slider.height, "yellow");
		drawRect(slider.getHandleX(), slider.handleY, slider.handleWidth, slider.handleHeight, "purple");
		
		var txtX = slider.x + slider.width/2;
		var txtY = slider.y - getFontWeight(this.buttonFont) + slider.spacing;
		colorText(slider.txt, txtX, txtY, "white", this.buttonFont, "center", opacity);
	},
};

var clamp = function(n, min, max) {
  return Math.min(Math.max(n, min), max);
};
