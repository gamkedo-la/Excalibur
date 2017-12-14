function lineSegment() {
	this.startPt = vec2.create();
	this.endPt = vec2.create();

	this.setEndPoints = function (sPt, ePt) {
		vec2.copy(this.startPt, sPt);
		vec2.copy(this.endPt, ePt);
	};
}
