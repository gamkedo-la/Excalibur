// Return true if the given aabb and line segment intersect; false otherwise
function isColliding_AABB_LineSeg(box, seg) {
	// Implementing a hacked up version of the separating axis theorem (2D simplified version)
	// This function is good only for boolean true/false testing.

	var segMidPt = vec2.create();
	vec2.set(segMidPt, (seg.startPt.x + seg.endPt.x) * 0.5, (seg.startPt.y + seg.endPt.y) * 0.5);

	var segHalfVec = vec2.create();
	vec2.sub(segHalfVec, seg.endPt, segMidPt);    // A half-length vector from the midpoint to the endpoint

	// Translate the box and the segment to the origin (i.e. move the segment midpoint by the amounts of the box center's position. This effectively treats the box center as though it's the origin, and the segment midpoint is translated relative to that origin)
	vec2.sub(segMidPt, segMidPt, box.center);

	if ( Math.abs(segMidPt.x) > box.width + Math.abs(segHalfVec.x) )
		return false;

	if ( Math.abs(segMidPt.y) > box.height + Math.abs(segHalfVec.y) )
		return false;

	// If we're here, then by process of elimination, the segment and box are intersecting
	return true;
}

// Return true 2 line segments are intersecting; false otherwise
function isColliding_LineSeg_LineSeg(objA, objB) {    // Given 2 line segments, where objA contains points A,B, and objB contains points C,D, the algorithm is as follows:
	var v1 = vec2.create();
	var v2 = vec2.create();
	var n = vec2.create();

	// First, compute n perpendicular to CD (objB's vector)
	vec2.sub(n, objB.endPt, objB.startPt);
	vec2.set(n, -n[1], n[0]);   // This is equivalent to rotating +90 deg (e.g. [1,0] -> [0, 1]; and [0,1] -> [-1, 0])
	vec2.normalize(n, n);

	vec2.sub(v1, objB.startPt, objA.startPt);   // v1 = C - A
	vec2.sub(v2, objA.endPt, objA.startPt);   // v2 = B - A

	// Compute the paramater, t, on the line segment given by L(t) = A + t(B - A).
	// if 0 <= t <= 1, then the segments are intersecting (and t can be used to compute the intersection)
	var t = vec2.dot(n, v1) / vec2.dot(n, v2);

	return (t >= 0 && t <= 1);
}


