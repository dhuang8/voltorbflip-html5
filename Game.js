var Game = function(){
	this.totalscore=0;
	this.difficulty=5;
	this.retrytimer=0.0;
	this.lefttimer=0;
	this.righttimer=0;
	this.play=true;
	this.playtimer=0;
	this.tag = new Array();
	for (var n=0;n<4;n++){
		this.tag[n]=false;
	}
	this.board = new Board(this.difficulty);
	this.mclick = function(x,y){
		if (this.play){
			if (inBounds(x,y,106,6,133+4*32,33+4*32)){
				this.play=this.board.touch(x,y,this.tag);
				if (this.play==false) this.board.bend();
			}
		}
		if (inBounds(x,y,293,171,350,194)){
			this.totalscore+=this.board.move(.02);
			this.board.newGame(this.difficulty);
			this.retrytimer=10.0;
			this.play=true;
			return;
		}
		else if (inBounds(x,y,42,159,65,178)){
			if (this.difficulty>0) this.difficulty--;
			this.lefttimer=7;
		}
		else if (inBounds(x,y,69,159,92,178)){
			if (this.difficulty<9) this.difficulty++;
			this.righttimer=7;
		}
		else {
			for (var n=0;n<4;n++){
				if (inBounds(x,y,312,36+24*n,335,59+24*n)){
					this.tag[n]=!this.tag[n];
				}
			}
		}
		this.playtimer=this.playtimer+0;
	}

	this.gmove = function(){
		this.board.move(1.0/60.0);
	}

	this.drawGame = function(deltaTime){
		//bool gtags[] = {false,false,false,false};
		//extern SpriteSheet * sheet;
		draw(vfbgtex,0,0,356,200);
		this.board.bdraw();
		var sscore = this.totalscore.toString();
		var len=sscore.length;
		for (var n=0;n<(5-len);n++){
			sscore="0"+sscore;
		}
		Numbers.draw(sscore,15,31,1);
		Numbers.draw(this.difficulty,15,158,1);
		if (this.retrytimer>0){
			this.retrytimer-=deltaTime*60;
			sheet.drawSheet(293,171,351,195,32);
		}
		if (this.lefttimer>0){
			this.lefttimer-=deltaTime*60;
			sheet.drawSheet(42,159,66,179,33);
		}
		if (this.righttimer>0){
			this.righttimer-=deltaTime*60;
			sheet.drawSheet(69,159,93,179,34);
		}
		for (var n=0;n<4;n++){
			if (this.tag[n]){
				sheet.drawSheet(312,36+24*n,336,60+24*n,44+n);
			}
		}

		//board->touch(110.f,20.f,gtags);
		//sheet->drawSheet(0,0,100,100,0);
		//panel->draw();
		//panel2->draw();
		//panel3->draw();

	}
}