
function calcRay(x, y, x2, y2, reflected){
	let ray = [];
	while(reflected > 0){
		
		[x2, y2] = checkRayToLine([x, y, x2, y2], walls);
		
		[x2, y2, connected] = checkRayToLine([x, y, x2, y2], mirrors);
		ray.push([x, y, x2, y2]);
		//demo.drawText(connected[0]+"/"+connected[1], x2, y2);
		if(connected && reflected > 0){
			[x, y, x2, y2] = calcRayReflection(x, y, x2, y2, connected);
			//demo.drawLineXY(x, y, x2, y2, "blue", 8);
			
			reflected--;
		}else {
			reflected = 0;
		}
	}
	return ray;
}

function calcRayReflection(x, y, x2, y2, [x3, y3, x4, y4]){
	let [rayX, rayY] = toUnitVector(x3, y3, x4, y4);
	[rayX, rayY] = [rayY, -rayX];
	
	let [rx, ry] = toUnitVector(x, y, x2, y2);
	//[rx, ry] = [-rx, -ry];
	
	let dp = dotProduct(rayX, rayY, rx, ry);
	//ERROR wrong normal
	//demo.drawLine(x2, y2, rayX*100, rayY*100, "yellow", 8);
	rayX = rx - (2 * rayX * dp);
	rayY = ry - (2 * rayY * dp);
	
	//demo.drawLine(x2, y2, rayX*100, rayY*100, "white", 8);
	return [x2, y2, x2+rayX * 1000, y2+rayY * 1000];
}

function checkRayToLine([x, y, x2, y2], arr){
	
	let minDist = 9999;
	let connectedWall = false;
	for(let line of arr){
		let [wx, wy, wx2, wy2] = line;
		let intPoint = checkLineIntersection(x, y, x2, y2, wx, wy, wx2, wy2);
		//demo.drawText(!intPoint ? "0" : "___1", x, y);
		if(intPoint && !(distanceBetwen(x,y, intPoint[0], intPoint[1]) < 3)){
			let [px, py] = intPoint;
			if(distanceBetwen(x,y, px, py) < 3)demo.drawLineXY(wx, wy, wx2, wy2, "red", 8);
			let ep = 0.01;
			//demo.drawText("_____"+((Math.abs(px - x) < ep && Math.abs(py - y) < ep) ? "true" : "___false"), px, py);
			//if(Math.abs(px - x) < ep && Math.abs(py - y) < ep) break;
			let dist = distanceBetwen(x, y, px, py);
			if(dist < minDist) {
				minDist = dist;
				[x2, y2, connectedWall] = [px, py, line];
			}
		}
	}
	return [x2, y2, connectedWall];
}