
function calcRay(x, y, x2, y2, reflected){
	let ray = [];
	while(reflected > 0){
		let minDistToWall = 9999;
		for(let wall of walls){
			[x2, y2, minDistToWall] = checkRayToLine([x, y, x2, y2], wall, minDistToWall);
		}
		let minDistToMirror = minDistToWall;
		let connectedMirror = false;
		for(let mirror of mirrors){
			[x2, y2, minDistToMirror] = checkRayToLine([x, y, x2, y2], mirror, minDistToMirror);
			if(minDistToMirror < minDistToWall) connectedMirror = mirror;
		}
		
		ray.push([x, y, x2, y2]);
		
		if(connectedMirror && reflected > 0){
			
			[x, y, x2, y2] = calcRayReflection(x, y, x2, y2, connectedMirror);
			reflected--;
		}else {
			reflected = 0;
		}
	}
	return ray;
}

function calcRayReflection(x, y, x2, y2, [x3, y3, x4, y4]){
	let [rayX, rayY] = toUnitVector(x3, y3, x4, y4);
	[rayX, rayY] = [-rayY, rayX];
	
	let [rx, ry] = toUnitVector(x, y, x2, y2);
	//[rx, ry] = [-rx, -ry];
	
	let dp = dotProduct(rayX, rayY, rx, ry);
	
	rayX = rx - (2 * rayX * dp);
	rayY = ry - (2 * rayY * dp);
	
	return [x2, y2, rayX * 1000, rayY * 1000];
}

function checkRayToLine([x, y, x2, y2], [wx, wy, wx2, wy2], minDist){
	
	let intPoint = checkLineIntersection(x, y, x2, y2, wx, wy, wx2, wy2);
	if(intPoint){
		let [px, py] = intPoint;
			//if(px !== x && py !== y) {
				if(px === x && py === y) return [x2, y2, minDist];
				let dist = distanceBetwen(x, y, px, py);
				if(dist < minDist) {
					minDist = dist;
					return [px, py, minDist];
			//}
		}
	}
	return [x2, y2, minDist];
}