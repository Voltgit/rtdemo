const WIDTH = 800;
const HEIGHT = 600;

const FPS = 60;
const drawDelay = 1000 / FPS;

let Demo = function() {
	this.canvas = document.getElementById("lightDemo");
	this.canvas.addEventListener("mousemove", onMouseMove);
	this.canvas.addEventListener("click", onMouseClick);
	this.g = this.canvas.getContext("2d");
	
	this.mousePos = [WIDTH / 2, HEIGHT / 2];
	
	this.drawLine = function(x, y, x2, y2, color = "white", lineWidth = 1){
		this.g.beginPath();
		
		this.g.moveTo(x, y);
		this.g.lineTo(x + x2, y + y2);
		
		this.g.lineWidth = lineWidth;
		this.g.strokeStyle = color;
		this.g.stroke();
	};
	
	this.drawLineXY = function(x, y, x2, y2, color, lineWidth){
		x2 -= x;
		y2 -= y;
		this.drawLine(x, y, x2, y2, color, lineWidth);
	};
	
	this.drawPolygon = function(x, y, points, color = "black"){
		this.g.fillStyle = color;
		this.g.beginPath();
		this.g.moveTo(points[0][0], points[0][1]);
		
		for(let [x2, y2] of points){
			this.g.lineTo(x2,y2);
		}
		
		this.g.closePath();
		this.g.fill();
	};
	
	this.clearScreen = function(){
		this.g.clearRect(0, 0, WIDTH, HEIGHT);
	};
	
	this.setMousePos = function(e){
		let rect = this.canvas.getBoundingClientRect();
		this.mousePos = [e.clientX - rect.left, 
						 e.clientY - rect.top];
		return this.mousePos;
	};
	
}

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
							 Math.sin(i) * this.radius]);
		}
	},
	
};

let inputs = {
	light: true,
	walls: false,
};

let demo = new Demo();

let walls = [[100, 100, 600, 400]]; //, [200, 100, 300, 600]

let markedWalls = new Set();

let clickPoint = false;

(function(){

	light.create(WIDTH / 2, HEIGHT / 2);
	
	document.getElementById("menu").addEventListener("click", applyInputs);
	
	inputs.light = document.getElementById("light");
	inputs.walls = document.getElementById("walls");
	inputs.lightType1 = document.getElementById("light-type1");
	inputs.lightType2 = document.getElementById("light-type2");
	inputs.wallsSet = document.getElementById("walls-set");
	inputs.wallsDelete = document.getElementById("walls-delete");
	
	setInterval(drawDemo, drawDelay);

})();






function drawDemo(){
	demo.clearScreen();
	
	drawWalls();
	
	drawLights();
	
}

function drawLights(){
	let [mouseX = 0, mouseY = 0] = demo.mousePos;
	
	let points = [];
	
	for(let [x2, y2] of light.rays){
		
		x2 += mouseX;
		y2 += mouseY;
		let intPoint = false;
		let minDistance = 9999;
		for(let [x3, y3, x4, y4] of walls){
			intPoint = checkLineIntersection(mouseX, mouseY, x2, y2, x3, y3, x4, y4);
			
			if(intPoint){
				let distance = dictanceBetwen(mouseX, mouseY, intPoint[0], intPoint[1]);
				if(distance < minDistance){
					minDistance = distance;
					x2 = intPoint[0];
					y2 = intPoint[1];
				}
			}
			
			
		}
		
		if(inputs.light.checked) {
		
			if(inputs.lightType1.checked){
				drawLightType1(mouseX, mouseY, x2, y2);
			}else{
				points.push([x2, y2]);
			}
		}
		
	}
	
	if(points[0]){
		drawLightType2(mouseX, mouseY, points);
	}
	
}

function drawLightType1(x, y, x2, y2){
	demo.drawLineXY(x, y, x2, y2);
	demo.drawLine(x2, y2, 2 , 2 , "yellow", 2);
}

function drawLightType2(x, y, points){
	demo.drawPolygon(x, y, points, "#a8aba2");
}

function drawWalls(){
	walls.forEach(function([x, y, x2, y2], index){
		if(markedWalls.has(index)){
			demo.drawLineXY(x, y, x2, y2, "blue", 5);
		}
		else{
			demo.drawLineXY(x, y, x2, y2, "green", 5);
		}
	});
	
	let [mouseX, mouseY] = demo.mousePos;
	if(clickPoint){
		let [x, y] = clickPoint;
		demo.drawLineXY(x, y, mouseX, mouseY, "blue", 5);
	}
}

function dictanceBetwen(x1, y1, x2, y2){
	let px1 = Math.min(x1, x2);
	let py1 = Math.min(y1, y2);
	
	let px2 = Math.max(x1, x2);
	let py2 = Math.max(y1, y2);
	
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	
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

function onMouseClick(e){
	if(inputs.walls.checked){
		
		if(inputs.wallsSet.checked){
			
			let [mouseX, mouseY] = demo.mousePos;
			if(!clickPoint){
				clickPoint = [mouseX, mouseY];
			}else{
				walls.push([clickPoint[0], clickPoint[1], mouseX, mouseY]);
				clickPoint = false;
			}
		}else {
			
			walls = walls.filter((item, index) => {
				if(!markedWalls.has(index)) return true;
			});
			
			/*for(let index of markedWalls){
				walls.splice(index, 1);
			}*/
			markedWalls.clear();
		}
	}else{
		clickPoint = false;
	}
}

function applyInputs(e) {
	if(inputs.walls.checked){
		inputs.wallsSet.disabled = false;
		inputs.wallsDelete.disabled = false;
		
		inputs.lightType1.disabled = true;
		inputs.lightType2.disabled = true;
	}else {
		inputs.lightType1.disabled = false;
		inputs.lightType2.disabled = false;
		
		inputs.wallsSet.disabled = true;
		inputs.wallsDelete.disabled = true;
	}
}

function onMouseMove(e){
	let [mouseX, mouseY] = demo.setMousePos(e);
	
	if(inputs.wallsDelete.checked){
		walls.forEach(function([x, y, x2, y2], index){
			if(checkLineIntersection(x, y, x2, y2, mouseX, mouseY-2, mouseX, mouseY+2) || 
			checkLineIntersection(x, y, x2, y2, mouseX-2, mouseY, mouseX+2, mouseY)){
				
				markedWalls.add(index);
				
			}else{
				markedWalls.delete(index);
			}
		});
	}
	
}


