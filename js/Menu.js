// Interface for quick clickable menus

// If position and size parameters are not passed, menu is created
// at canvas center. Sizing is determined automatically based on content.
function Menu(title, textColor = "white", backgroundColor = "black", leftX=-1, topY=-1) {

    this.title = title;

    this.textColor = textColor;
    this.backgroundColor = backgroundColor;

    if (leftX != -1 && this.topY != -1) {
        this.x = leftX;
        this.y = topY;
    } else {
        // TODO find canvas center
        this.x = 100;
        this.y = 100;
    }

    if (height != -1 && width != -1) {
        this.height = height;
        this.width = width;
    }

    this.options = [];
}

function MenuOption(optionText, action) {
    this.text = optionText;
    this.action = action;
}

Menu.prototype.draw = function() {
    // Draw background rectangle
    canvasContext.fillStyle = this.backgroundColor;
    canvasContext.fillRect(this.x, this.y, this.width, this.height);

    for (let i = 0; i < this.options.length; i++) {
    }

};

Menu.prototype.update = function() {

};

// Adds an option to the menu. Action is a funciton to be executed when
// the menu option is clicked.
Menu.prototype.addOption = function(optionText, action) {
    console.log("Adding option ", optionText);
    this.options.push(MenuOption(optionText, action));
    // TODO update menu width and height
};

