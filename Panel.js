var Panel = function (avalue, apos){
	this.value=avalue;
	this.pos=apos;
	this.state=0;
	this.end=false;
	this.tags = new Array();
	this.timer=0;
	for (var i=0;i<4;i++){
		this.tags[i]=false;
	}
	this.getValue=function(){
		return this.value;
	}

	this.click=function(){
		if (this.state==0){
			this.state=1;
			return true;
		}
		return false;
	}

	this.clickB= function(button){
		if (button[0] || button[1] || button[2] || button[3]){
			this.tag(button);
		}
		else {
			if (this.state==0) {
				this.state=1;
				return true;
			}
		}
		return false;
	}

	this.tag=function(button){
		for (var n=0;n<4;n++){
			if (this.tags[n]==button[n]) this.tags[n]=false;
			else this.tags[n]=true;
		}
	}
	
	this.move=function(deltaTime){
		if ((this.state>0 && this.state<4) || this.state<0){
			if (this.timer<4) {
				this.timer+=deltaTime*60;
				return;
			}
			this.timer=0;
			this.state++;
		}
		else if (this.state>3 && this.value==0 && this.state<14 && this.end==false){
			if (this.timer<6) {
				this.timer+=deltaTime*60;
				return;
			}
			this.timer=0;
			this.state++;
		}
	}
	
	this.endf=function(){
		this.end=true;
		this.click();
	}
	
	this.close = function(){
		if (this.state!=0) this.state=-3;
		return (this.state==0);
	}
	
	this.draw = function(){
		var n=this.pos%5;
		var m=Math.floor(this.pos/5);
		//if (state>7) Assets.sheet.setBlend(true);
		//else Assets.sheet.setBlend(false);
		if (this.state==4 || this.state==14) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, this.value);
		else if (this.state==0) {
			sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 4);
			for (var x=0;x<4;x++){
				if (this.tags[x]) sheet.drawSheet(110+n*32+(x%2)*15, 10+m*32+Math.floor(x/2)*15, 110+5+n*32+(x%2)*15, 10+5+m*32+Math.floor(x/2)*15, x+48);
			}
		}
		else if (Math.abs(this.state)==3) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, this.value+5);
		else if (Math.abs(this.state)==2) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 30);
		else if (Math.abs(this.state)==1) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 9);
		if (this.state>4 && this.state!=14) return true;
	
		return false;
	}
	
	this.draw2=function(){
		var n=this.pos%5	;
		var m=Math.floor(this.pos/5);
		//if (state>7) Assets.sheet.setBlend(true);
		//else Assets.sheet.setBlend(false);
		if (this.state==5) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 35);
		else if (this.state==6) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 36);
		else if (this.state==7) sheet.drawSheet(109+n*32, 9+m*32, 109+22+n*32, 9+22+m*32, 37);
		else if (this.state==8) sheet.drawCenter(109+11+n*32, 9+11+m*32, 38);
		else if (this.state==9) sheet.drawCenter(109+11+n*32, 9+11+m*32, 39);
		else if (this.state==10) sheet.drawCenter(109+11+n*32, 9+11+m*32, 40);
		else if (this.state==11) sheet.drawCenter(109+11+n*32, 9+11+m*32, 41);
		else if (this.state==12) sheet.drawCenter(109+11+n*32, 9+11+m*32, 42);
		else if (this.state==13) sheet.drawCenter(109+11+n*32, 9+11+m*32, 43);
	}
}