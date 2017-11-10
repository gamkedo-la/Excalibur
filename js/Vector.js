// NOTE: this code is derived from gl-Matrix (http://glmatrix.net/). The relevant copyright info for gl-Matrix follows:

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.                                                                                                                                                                                                                 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */


// A vectorObject class
function vectorObject(xin = 0.0, yin = 0.0) {
    this.v = [xin, yin];
}

// getter/setter properties, to allow developers to work with vecObj.x and vecObj.y, instead of vecObj.v[0], and vecObj.v[1]
Object.defineProperty(vectorObject.prototype, 'x', {
    get: function() { return this.v[0]; },
    set: function(inp) { this.v[0] = inp; }
});

Object.defineProperty(vectorObject.prototype, 'y', {
    get: function() { return this.v[1]; },
    set: function(inp) { this.v[1] = inp; }
});

// ------------------------------------------------------------
// A "namespace" for all vector operations
// The idea here is: vector operations will be called like vec2.funcCall(outVec, inputA, inputB), or similar
// This saves memory, as only one var has all the vector math properties defined on it; and every
// vectorObject can contain a minimal amount of data
//
// Note that the following functions operate "in-place" on a vectorObject, but also return the object to 
// the calling scope. That allows vector operations to be chained together.


var vec2 = {};

// Create a new vectorObject and return it. The developer should never have to create a new
// vectorObject() directly
vec2.create = function(x = 0.0, y = 0.0) {
	var out = new vectorObject(x, y);
	return out;
};


vec2.clone = function(a) {
	var out = new vectorObject(a.v[0], a.v[1]);
	return out;
};


vec2.copy = function(out, a) {
	out.v[0] = a.v[0];
	out.v[1] = a.v[1];
	return out;
};


vec2.add = function(out, a, b) {
	out.v[0] = a.v[0] + b.v[0];
	out.v[1] = a.v[1] + b.v[1];
	return out;
};


vec2.sub = function(out, a, b) {
	out.v[0] = a.v[0] - b.v[0];
	out.v[1] = a.v[1] - b.v[1];
	return out;
};


vec2.dot = function(a, b) {
	return (a.v[0] * b.v[0]) + (a.v[1] * b.v[1]);
};


vec2.scale = function(out, a, k) {
	out.v[0] = a.v[0] * k;
	out.v[1] = a.v[1] * k;
	return out;
};


// Scale b by k, and add to a
vec2.scaleAndAdd = function (out, a, b, k) {
	out.v[0] = a.v[0] + (b.v[0] * k);
	out.v[1] = a.v[1] + (b.v[1] * k);
	return out;
};


// The squared distance between 2 vectorObjects (because.. we can use vectorObjects as points)
vec2.sqDist = function(a, b) {
	var x = a.v[0] - b.v[0];
	var y = a.v[1] - b.v[1];
	return x*x + y*y;
};


// Length of a
vec2.len = function(a) {
	return Math.sqrt(a.v[0]*a.v[0] + a.v[1]*a.v[1]);
};


// Squared length of a
vec2.sqLen = function(a) {
	return a.v[0]*a.v[0] + a.v[1]*a.v[1];
};


vec2.normalize = function(out, a) {
	var sqLen = a.v[0]*a.v[0] + a.v[1]*a.v[1];
	if (sqLen  > 0) {
		sqLen = 1 / Math.sqrt(sqLen);
		out.v[0] = out.v[0] * sqLen;
		out.v[1] = out.v[1] * sqLen;
	} else {
		console.log("vec2.normalize() called on a 0-length vector");
	}
	return out;
};

vec2.str = function(a) {
	return 'vec2(' + a.v[0] + ', ' + a.v[1] + ')';
};


vec2.exactEquals = function(a, b) {
	return a.v[0] === b.v[0] && a.v[1] === b.v[1];
};


vec2.equals = function(a, b, epsilon = 1e-5) {
	// TODO if we find ourselves doing float comparisons in a lot of places, we may want to put epsilon into a common math class
	return Math.abs(a.v[0]-b.v[0]) <= epsilon && Math.abs(a.v[1] - b.v[1]) <= epsilon;
};
