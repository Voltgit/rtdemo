const WIDTH = 800;
const HEIGHT = 600;

const FPS = 60;
const drawDelay = 1000 / FPS;

let Demo = function() {
	this.canvas = document.getElementById("lightDemo");
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
		this.g.moveTo(points[0][0] + x, points[0][1] + y);
		
		for(let [x2, y2] of points){
			this.g.lineTo(x + x2, y + y2);
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

(function(){

	light.create(WIDTH / 2, HEIGHT / 2);
	
	inputs.light = document.getElementById("light");
	inputs.walls = document.getElementById("walls");
	
	setInterval(drawDemo, drawDelay);

})();






function drawDemo(){
	demo.clearScreen();
	
	drawWalls();
	if(inputs.light.checked)drawLight();
	
}

function drawLight(){
	let [mouseX = 0, mouseY = 0] = demo.mousePos;
	
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
		
		demo.drawLineXY(mouseX, mouseY, x2, y2);
		demo.drawLine(x2, y2, 2 , 2 , "yellow", 2);
		
		
		
	}
	
	//demo.drawPolygon(mouseX, mouseY, light.rays);
}

function drawWalls(){
	for(let [x, y, x2, y2] of walls){
		demo.drawLineXY(x, y, x2, y2, "green", 5);
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

let clickPoint = false;

function onMouseClick(e){
	if(inputs.walls.checked){
		let [mouseX, mouseY] = demo.mousePos;
		if(!clickPoint){
			clickPoint = [mouseX, mouseY];
		}else{
			walls.push([clickPoint[0], clickPoint[1], mouseX, mouseY]);
			clickPoint = false;
		}
	}else{
		clickPoint = false;
	}
}

function onMouseMove(e){
	demo.setMousePos(e);
}


