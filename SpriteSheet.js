var SpriteSheet = function(texture,size,mwidth,mheight){
	this.counter=0;
	this.text=texture;
	this.width=mwidth;
	this.height=mheight;
	this.spritex=new Array();
	this.spritey=new Array();
	this.spritesize=new Array();
	
	this.add= function(left,vtop,right,bot){
		this.spritex[this.counter]=left;
		this.spritey[this.counter]=vtop;
		this.counter++;
		this.spritex[this.counter]=right;
		this.spritey[this.counter]=bot;
		this.counter++;
	}
	
	this.addS= function(left,vtop,right,bot,size){
		this.spritesize[this.counter/2]=size;
		this.add(left,vtop,right,bot);
	}
	
	this.drawSheet= function(left,vtop,right,bot,count){
		var sleft=this.spritex[count*2]/this.width;
		var stop= this.spritey[count*2]/this.height;
		var sright=this.spritex[count*2+1]/this.width;
		var sbot= this.spritey[count*2+1]/this.height;
		drawS(this.text,left,vtop,right,bot,sleft,stop,sright,sbot);
		//console.log(left+" "+vtop+" "+right+" "+bot+" "+sleft+" "+stop+" "+sright+" "+sbot);
	}
	
	this.drawCenter = function(x, y, count){
		this.drawSheet(x-this.spritesize[count]/2,y-this.spritesize[count]/2,x+this.spritesize[count]/2,y+this.spritesize[count]/2,count);
	}
}