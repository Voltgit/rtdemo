const settingsButtonsSelector = "-settings-buttons";

let Input = function(selector){
	this.buttons = document.getElementsByName(selector + settingsButtonsSelector);
	
	this.checked = false;
	
	this.get = function(num){
		let chk = false;
		this.buttons.forEach((item, index) => {
			if(item.checked && index === (num - 1)) chk =  true;
		});
		return chk;
	};
	this.getSafe = function(num){
		if(this.checked) {
			return this.get(num);
		}
		return false;
	}
	this.setDisabled = function(value){
		for(let e of this.buttons){
			e.disabled = value;
		}
	};
	
	this[Symbol.toPrimitive] = function(hint){
		return checked;
	};
};

let Inputs = function(selector){
	this.inputs = document.getElementsByName(selector);
	
	for(let e of this.inputs){
		this[e.id] = new Input(e.id);
	}
	
	this.tick = function(event){
		if(event){
			let id = (event.target.id.split("-"))[0];
			if(id){
				document.getElementById(id).checked = true;
			}
		}
		for(let e of this.inputs){
			if(!e.checked){
				this[e.id].checked = false;
				//this[e.id].setDisabled(true);
			}else {
				this[e.id].checked = true;
				//this[e.id].setDisabled(false);
			}
		}
	};
	this.tick();
};

let mouse = {
	clickPoint: false,
	inProcess: true,
	
	getLine() {
		if(this.clickPoint){ 
			let [x, y] = demo.mousePos;
			let [x2, y2] = this.clickPoint;
			this.clickPoint = false;
			return [x, y, x2, y2];
		}
		return false;
	}
};




