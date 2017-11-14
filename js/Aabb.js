function aabb(width = 0, height = 0) {
	this.center = vec2.create();

	// halfSizes in an AABB are the half-widths along each axis
	this.halfSizes = [width, height];		// Store half-widths in an array to keep data contiguous

	this.minPt = vec2.create();
	this.maxPt = vec2.create();

	this.computeBounds = function () {
		// Compute min and max boundary points. This assumes that the AABB's center has already been set
		this.minPt.x = this.center.x - this.width;
		this.minPt.y = this.center.y - this.height;
		
		this.maxPt.x = this.center.x + this.width;
		this.maxPt.y = this.center.y + this.height;
	};

	this.setCenter = function(x, y) {
		vec2.set(this.center, x, y);
	};

	// Set half-sizes
	this.setHalfSizes = function(x, y) {
		this.width = x;
		this.height = y;
	};
}

// getter/setter properties, to allow developers to work with aabb.width and aabb.height, instead of aabb.halfSizes[0], and aabb.halfSizes[1]
Object.defineProperty(aabb.prototype, 'width', {
	get: function() { return this.halfSizes[0]; },
	set: function(inp) { this.halfSizes[0] = inp; }
});

Object.defineProperty(aabb.prototype, 'height', {
	get: function() { return this.halfSizes[1]; },
	set: function(inp) { this.halfSizes[1] = inp; }
});
