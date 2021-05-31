function toUnitVector(x1, y1, x2, y2){
	let dist = distanceBetwen(x1, y1, x2, y2);
	return  [(x2 - x1) / dist
			,(y2 - y1) / dist];
}
function dotProduct(x1, y1, x2, y2){
	return (x1 * x2 + y1 * y2);
}
function checkLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4){
	let den = ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
		if (den === 0) return false;

		let t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		let u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
		
		if (t > 0 && t < 1 && u > 0 && u < 1) {
			return [(x1 + t * (x2-x1)),(y1 + t*(y2 - y1))];
		}

		return false;
}
function distanceBetwen(x1, y1, x2, y2){
	let px1 = Math.min(x1, x2);
	let py1 = Math.min(y1, y2);
	
	let px2 = Math.max(x1, x2);
	let py2 = Math.max(y1, y2);
	
	return Math.sqrt((px2 - px1) * (px2 - px1) + (py2 - py1) * (py2 - py1));
	
}
function checkPointOnLine(px, py, x, y, x2, y2, buffer = 0.5){
	let dist1 = distanceBetwen(px, py, x, y);
	let dist2 = distanceBetwen(px, py, x2, y2);
	let length = distanceBetwen(x, y, x2, y2);
	return (dist1 + dist2 >= length - buffer && dist1+dist2 <= length + buffer) ? true : false;
}