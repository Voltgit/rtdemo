const WIDTH = 800;
const HEIGHT = 600;

const FPS = 60;
const drawDelay = 1000 / FPS;

let Demo = function() {
	this.canvas = document.getElementById("lightDemo");
	this.canvas.addEventListener("mousemove", onMouseMove);
	this.canvas.addEventListener("mousedown", onMouseDown);
	this.canvas.addEventListener("mouseup", onMouseUp);
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
	
	this.drawText = function(text, x, y, size = 25, color = "white"){
		this.g.beginPath();
		this.g.font = size + "px Arial";
		this.g.fillStyle = color;
		this.g.fillText(text, x, y);
		this.g.closePath();
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
