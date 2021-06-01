
let inputs = new Inputs("settings");

let demo = new Demo();

let light = {
	x: 0,
	y: 0,
	
	radius: Math.sqrt(WIDTH**2 + HEIGHT**2), //1000
	
	lightCount: 360,
	
	rays: [],
	
	create(x, y) {
		this.x = x;
		this.y = y;
		
		for(let i = 0; i < 2 * Math.PI; i+= Math.PI / this.lightCount){
			this.rays.push([ Math.cos(i) * this.radius, 
							 Math.sin(i) * this.radius, 5]);
		}
		/*this.rays.push([300, -1000, 5]);
		this.rays.push([-1000, 0, 5]);
		this.rays.push([1000, 0, 5]);*/
	},
	
};

let Laser = function(x, y, angle, rayColor = "red", raySize = 3, 
					 bodyColor = "blue", bodySize = 8, bodyLength = 50){
	this.x = x;
	this.y = y;
	this.x2 = x + angle[0] * bodyLength;
	this.y2 = y + angle[1] * bodyLength;
	this.laserX = this.x2 + angle[0] * 1000;
	this.laserY = this.y2 + angle[1] * 1000;
	this.angle = angle;
	this.rayColor = rayColor;
	this.raySize = raySize;
	this.bodyColor = bodyColor;
	this.bodySize = bodySize;
}

//let walls = [[100, 100, 600, 400]];

//[x, y, x2, y2, metadata]
//metadata: 0 - walls
//			1 - mirrors
// 			2 - lasers
let meta = {
	walls: 0,
	mirrors: 1,
	lasers: 2,
}
let walls = [];//[[100, 100, 600, 400]];

let mirrors = [[500, 100, 700, 109]];//, [390, 290, 550, 230]

let lasers = [];

let marked = new Map();


let clickPoint = false;

(function(){

	light.create(WIDTH / 2, HEIGHT / 2);
	let asd = 2;
	document.getElementById("menu").addEventListener("click", applyInputs);
	
	marked.set(walls, new Set());

	marked.set(mirrors, new Set());

	marked.set(lasers, new Set());
	
	lasers.push(new Laser(730, 480, [-0.2, -0.8]), meta.lasers);
	
	setInterval(drawDemo, drawDelay);

})();



function drawDemo(){
	demo.clearScreen();
	
	drawWalls();
	
	drawMirrors();
	
	drawLights();
	
	drawLasers();
}

function drawLasers(){
	lasers.forEach((item, index) => {
		let color = marked.get(lasers).has(index) ? "yellow" : item.bodyColor;
		demo.drawLineXY(item.x, item.y, item.x2, item.y2, color, item.bodySize);
		let calculatedRay = calcRay(item.x2, item.y2, item.laserX, item.laserY, 20);
		for(let [x, y, x2, y2] of calculatedRay){
			demo.drawLineXY(x, y, x2, y2, item.rayColor, item.raySize);
		}
	});
	if(inputs.lasers.getSafe(1) && mouse.clickPoint){
		let [mouseX, mouseY] = demo.mousePos;
		let [x, y] = mouse.clickPoint;
		demo.drawLineXY(x, y, mouseX, mouseY, "red", 3);
	}
}

function drawLights(){
	let [mouseX = 0, mouseY = 0] = demo.mousePos;
	
	let points = [];
	
	let rays = []; // reflected rays
	
	for(let [x2, y2, reflected] of light.rays){
		
		x2 += mouseX;
		y2 += mouseY;
		/*let intPoint = false;
		let minDistance = 9999;
		for(let [x3, y3, x4, y4] of walls){
			intPoint = checkLineIntersection(mouseX, mouseY, x2, y2, x3, y3, x4, y4);
			
			if(intPoint){
				let distance = distanceBetwen(mouseX, mouseY, intPoint[0], intPoint[1]);
				if(distance < minDistance){
					minDistance = distance;
					x2 = intPoint[0];
					y2 = intPoint[1];
					
					let [rayX, rayY] = toUnitVector(x3, y3, x4, y4);
					[rayX, rayY] = [-rayY, rayX];
					
					let [rx, ry] = toUnitVector(mouseX, mouseY, x2, y2);
					//[rx, ry] = [-rx, -ry];
					
					
					let dp = dotProduct(rayX, rayY, rx, ry);
					
					rayX = rx - (2 * rayX * dp);
					rayY = ry - (2 * rayY * dp);
					//console.log(rayX)
					
					rays.push([x2, y2, rayX * 1000, rayY * 1000]);
				}
			}
			
			
		}*/
		
		//console.log(calcRays);
		if(inputs.light.checked) {
			let calculatedRay = calcRay(mouseX, mouseY, x2, y2, 5);
			if(inputs.light.get(1)){
				for(let [mouseX, mouseY, x2, y2] of calculatedRay){
					drawLightType1(mouseX, mouseY, x2, y2);
				}
				
			}else{
				points.push([x2, y2]);
			}
		}
		
	}
	
	if(points[0]){
		drawLightType2(mouseX, mouseY, points);
	}
	
	rays.forEach(function([x, y, x2, y2], index){
		demo.drawLine(x, y, x2, y2, "red");
	});
	
}
function drawLightType1(x, y, x2, y2){
	demo.drawLineXY(x, y, x2, y2);
	//demo.drawLine(x2, y2, 2 , 2 , "yellow", 2);
}

function drawLightType2(x, y, points){
	demo.drawPolygon(x, y, points, "#a8aba2");
}

function drawWalls(){
	walls.forEach(function([x, y, x2, y2], index){
		if(marked.get(walls).has(index)){
			demo.drawLineXY(x, y, x2, y2, "blue", 5);
		}
		else{
			demo.drawLineXY(x, y, x2, y2, "green", 5);
		}
	});
	
	if(inputs.walls.getSafe(1) && mouse.clickPoint){
		let [mouseX, mouseY] = demo.mousePos;
		let [x, y] = mouse.clickPoint;
		demo.drawLineXY(x, y, mouseX, mouseY, "blue", 5);
	}
}

function drawMirrors(){
	mirrors.forEach(function([x, y, x2, y2], index){
		if(marked.get(mirrors).has(index)){
			demo.drawLineXY(x, y, x2, y2, "white", 5);
			demo.drawLineXY(x, y, x2, y2, "blue", 3);
		} else {
			demo.drawLineXY(x, y, x2, y2, "yellow", 5);
			demo.drawLineXY(x, y, x2, y2, "green", 3);
		}
	});
	
	if(inputs.mirrors.getSafe(1) && mouse.clickPoint){
		let [mouseX, mouseY] = demo.mousePos;
		let [x, y] = mouse.clickPoint;
		demo.drawLineXY(x, y, mouseX, mouseY, "yellow", 5);
		demo.drawLineXY(x, y, mouseX, mouseY, "green", 3);
	}
}

function onMouseDown(e){
	mouse.clickPoint = demo.mousePos;
}
function onMouseUp(e){
	let line = mouse.getLine();
	
	if(inputs.walls.checked) checkWall(line);
		
	if(inputs.mirrors.checked) checkMirror(line);
	
	if(inputs.lasers.checked) checkLaser(line);
}

function checkLaser(line){
	if(inputs.lasers.get(1)){
		
		let [x2, y2, x, y] = line;
		line = toUnitVector(x, y, x2, y2);
		lasers.push(new Laser(x, y, line));
			
	}else if (inputs.lasers.get(2)){
		
		deleteMarked(lasers);
	}
}

function checkWall(line){
	if(inputs.walls.get(1)){
			
		walls.push(line);
			
	}else if (inputs.walls.get(2)){
		
		deleteMarked(walls);
	}
}
function checkMirror(line){
	if(inputs.mirrors.get(1)){
			
		mirrors.push(line);
			
	}else if (inputs.mirrors.get(2)){
		
		deleteMarked(mirrors);
	}
}

function deleteMarked(arr){
	for(let i = arr.length - 1; i >= 0; i--){
			if(marked.get(arr).has(i)){
				arr.splice(i, 1);
			}
		}
	marked.get(arr).clear();
}

function applyInputs(e) {
	inputs.tick(e);
}

function onMouseMove(e){
	let [mouseX, mouseY] = demo.setMousePos(e);
	
	if(inputs.walls.checked && inputs.walls.get(2)){
		checkMouseOnElements(mouseX, mouseY, walls, marked.get(walls))
	}
	if(inputs.mirrors.checked && inputs.mirrors.get(2)){
		checkMouseOnElements(mouseX, mouseY, mirrors, marked.get(mirrors))
	}
	if(inputs.lasers.checked && inputs.lasers.get(2)){
			lasers.forEach(function({x, y, x2, y2}, index){
			if(checkPointOnLine(mouseX, mouseY, x, y, x2, y2)){
				marked.get(lasers).add(index);
			}else{
				marked.get(lasers).delete(index);
			}
		});
	}
	
}
function checkMouseOnElements(mx, my, arr, markedArr){
	
	arr.forEach(function([x, y, x2, y2], index){
		
		if(checkPointOnLine(mx, my, x, y, x2, y2)){
			markedArr.add(index);
		}else{
			markedArr.delete(index);
		}
	});
}









