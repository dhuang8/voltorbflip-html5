var Board = function(d){
	this.boardp = new Array();
	this.difficulty=d;
	this.score;
	this.endtimer;
	this.maxscore;
	this.start;
	this.first;
	this.total=new Array();
	
	this.newGame = function(d){
		if (this.start==-1){
			this.start=0;
			this.difficulty=d;
			var close=true;
			for (var n=0;n<25;n++){
				close=(this.boardp[n].close() && close);
			}
			if (close) this.start=20;
		}
	}
	
	this.newBoard = function(){
		this.score=0;
		this.first=true;
		this.start=-1;
		this.endtimer=-1;
		var d=this.difficulty;
		var rando=Math.random();
		var three,two,one,zero,maxtwo;
		maxtwo=d+3;
		zero=d+3;
		var two2=rando*(maxtwo+1);
		two=Math.floor(two2);
		three=Math.floor((maxtwo-two)*2/3);
		rando=Math.random();
		if (rando<(two2-two)) three++;
		one=25-three-two-zero;
		this.maxscore=Math.pow(2,two)*Math.pow(3,three);
		this.genBoard(zero,one,two,three);
		this.calcTotal();
	}
	
	this.calcTotal= function(){
		var count=0;
		var s="";
		var zero="0";
		for (var m=0;m<5;m++){
			count=0;
			s="";
			for (var n=0;n<5;n++){
				count+=this.boardp[m+n*5].getValue();
			}

			if (count>9){
				s+=(count-10);
				s="1"+s;
			}
			else{
				s+=count;
				s="0"+s;
			}
			this.total[m]=s;
		}

			//count num col
		for (var m=0;m<5;m++){
			count=0;
			s="";
			for (var n=0;n<5;n++){
				count+=this.boardp[m*5+n].getValue();
			}

			if (count>9){
				s+=(count-10);
				s="1"+s;
			}
			else{
				s+=count;
				s="0"+s;
			}
			this.total[m+5]=s;
		}
		for (var m=0;m<5;m++){
			count=0;
			s="";
			for (var n=0;n<5;n++){
				if (this.boardp[m+n*5].getValue()==0) count++;
			}

			s+=count;
			this.total[m+10]=s;
		}
			//count 0 col
		for (var m=0;m<5;m++){
			count=0;
			s="";
			for (var n=0;n<5;n++){
				if (this.boardp[m*5+n].getValue()==0) count++;
			}
			s+=count;
			this.total[m+15]=s;
		}
	}
	
	this.genBoard = function(a,b,c,d){
		var val=new Array();
		var count=0;
		for (var n=0;n<a;n++){
			val[count]=0;
			count++;
		}
		for (var n=0;n<b;n++){
			val[count]=1;
			count++;
		}
		for (var n=0;n<c;n++){
			val[count]=2;
			count++;
		}
		for (var n=0;n<d;n++){
			val[count]=3;
			count++;
		}

		var rando;
		for (var n=24;n>0;n--){ //the shuffle
			rando=Math.floor(Math.random()*(n+1));
			this.boardp[n]=new Panel(val[rando],n);
			val[rando]=val[n];
		}
		this.boardp[0]=new Panel(val[0],0);
	}
	
	this.move = function(deltaTime){
		for (var n=0;n<25;n++){
			this.boardp[n].move(deltaTime);
		}
		if (this.endtimer>-1) this.endtimer++;
		if (this.endtimer>120){
			this.endtimer=-1;
			for (var n=0;n<25;n++){
				this.boardp[n].endf();
			}
		}
		if (this.start>-1) this.start++;
		if (this.start>20){
			this.start=-1;
			this.newBoard();
			return 0;
		}
		if (this.start>-1) return 0;
		return this.score;
	}
	
	this.bend = function(){
		this.endtimer=0;
		if (this.maxscore==this.score) this.endtimer=80;
	}
	
	this.touch = function(x,y,tag){
		for (var m=0;m<5;m++){
			for (var n=0;n<5;n++){
				if (inBounds (x,y,106+m*32,6+n*32,133+m*32,33+n*32)){
					if (this.boardp[n*5+m].clickB(tag)){
						if (this.first) this.score=1;
						this.first=false;
						this.score=this.score*this.boardp[n*5+m].getValue();
						if (this.score==0) return false;
						else if (this.score==this.maxscore) return false;
					}
				}
			}
		}
		return true;
	}
	
	this.bdraw = function(){
		for (var m=0;m<5;m++){
			Numbers.draw(this.total[m], 117+m*32, 168, 0);
			Numbers.draw(this.total[m+5], 277, 8+m*32, 0);
			Numbers.draw(this.total[m+10], 125+m*32, 181, 0);
			Numbers.draw(this.total[m+15], 285, 21+m*32, 0);
			//if (Math.random()>.9)	console.log(this.total[m].toString());
		}

		var sscore = this.score.toString();
		var len=sscore.length;
		for (var n=0;n<(5-len);n++){
			sscore="0"+sscore;
		}
		
		Numbers.draw(sscore,15,100,1);

		var bomb=-1;
		for (var m=0;m<25;m++){
			if(this.boardp[m].draw()) bomb=m;
		}
		if (bomb>-1) this.boardp[bomb].draw2();
	}
	
	this.newBoard();
}

function inBounds( x,  y,  left,  top,  right,  bot) {
	if(x > left && x < right &&
			y > top && y < bot)
		return true;
	else
		return false;
}