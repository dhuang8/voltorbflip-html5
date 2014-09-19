var gl;
var vfbgtex,sstex;
var loaded=0;
var triangleVertexPositionBuffer;
var squareVertexPositionBuffer;
var targetwidth=356;
var targetheight=200;
var squarebuffer;
var shaderProgram;
var testPanel;
var prevtime=(new Date).getTime();

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL");
	}
}	

function initTextures() {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
//	gl.enable(gl.DEPTH_TEST);
	
	vfbgtex = gl.createTexture();
//	gl.bindTexture(gl.TEXTURE_2D, tex);
//	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255])); // red
	var img = new Image();
	img.onload = function() { handleTextureLoaded(vfbgtex,img); }
	img.src = "vfbg.png";
	vfbgtex = gl.createTexture();

	sstex = gl.createTexture();
	img2 = new Image();
	img2.onload = function() { handleTextureLoaded(sstex,img2); }
	img2.src = "sheet.png";
	
	sheet=new SpriteSheet(sstex,52.0,406.0,394.0);
	for (var n=0;n<2;n++){
		for (var m=0;m<5;m++){
			sheet.add(n*23, m*23, n*23+22, m*23+22); //0-9
		}
	}
	for (var n=0;n<10;n++){
		sheet.add(n*7, 115, n*7+6, 123); //10-19 small num
	}
	for (var n=0;n<5;n++){
		sheet.add(n*16, 124, n*16+14, 146); //20-24 bi g num
	}
	for (var n=0;n<5;n++){
		sheet.add(	n*16, 147, n*16+14, 169); //25-29 big num
	}
	sheet.add(2*23, 4*23, 2*23+22, 4*23+22); //30 halfway open
	sheet.add(46, 0, 74, 28); //31 red selection square
	sheet.add(75, 0, 133, 24); //32 retry button
	sheet.add(70, 79, 94, 99); //33 left button
	sheet.add(70, 100, 94, 120); //34 right button
	sheet.add(0, 171, 22, 193); //35 explosions
	sheet.add(23, 171, 45, 193); //36
	sheet.add(46, 171, 68, 193); //37
	sheet.addS(0, 194, 34, 228,34); //38
	sheet.addS(0, 229, 42, 271,42); //39
	sheet.addS(0, 272, 56, 328,56); //40
	sheet.addS(0, 330, 60, 390,60); //41
	sheet.addS(43, 194, 105, 256,105-43); //42
	sheet.addS(57, 257, 121, 321,121-57); //43
	for (var n=0;n<2;n++){
		for (var m=0;m<2;m++){
			sheet.add(46+m*25, 29+n*25, 70+m*25, 53+n*25); //44-47
		}
	}
	for (var n=0;n<2;n++){
		for (var m=0;m<2;m++){
			sheet.add(96+m*6, 25+n*6, 101+m*6, 30+n*6); //48-51
		}
	}
	
	game = new Game(5);
}
function handleTextureLoaded(texture,image) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	loaded++;

	//	gl.activeTexture(gl.TEXTURE0);	
}

function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert("Could not initialise shaders");
	}
	
	gl.useProgram(shaderProgram);

	shaderProgram.vPosition = gl.getAttribLocation(shaderProgram, "vPosition");
	shaderProgram.a_texCoord = gl.getAttribLocation(shaderProgram, "a_texCoord");
	gl.enableVertexAttribArray(shaderProgram.vPosition);
	gl.enableVertexAttribArray(shaderProgram.a_texCoord);

	shaderProgram.uMVPMatrix = gl.getUniformLocation(shaderProgram, "uMVPMatrix");
}

function getShader(gl, id) {	
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("SHADER : " + gl.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}
var sheet;
function initBuffers() {	
	squarebuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, squarebuffer);
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function drawScene() {
	if (loaded<2) return;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	//sheet.drawSheet(0,0,100,100,20);
	var curtime=(new Date).getTime();
	game.gmove((curtime-prevtime)/1000.0);
	game.drawGame((curtime-prevtime)/1000.0);
	prevtime=curtime;
	gl.flush();
}

function draw(texture, left, vtop, right, bot){
	drawS(texture,left,vtop,right,bot,0.0,0.0,1.0,1.0)
}

function drawS(texture, left, vtop, right, bot,sleft,stop,sright,sbot){
	var width = (right-left) /2.0;
	var height = (bot - vtop) /2.0;
	var centerx = (targetwidth/2.0)-((left + right)/2.0);
	var centery = (targetheight)/2.0-(vtop+bot)/2.0;

	var vertices = [-width,height, 0.0 , 1.0, sleft, sbot,
	                -width,-height, 0.0 , 1.0, sleft, stop,
	                width,height, 0.0 , 1.0, sright, sbot,
	                width,-height, 0.0 , 1.0, sright, stop];
	gl.bindBuffer(gl.ARRAY_BUFFER, squarebuffer);
	gl.bufferData(gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            gl.STATIC_DRAW);
	
	gl.bindTexture(gl.TEXTURE_2D, texture);
	//gl.activeTexture(gl.TEXTURE0);
	gl.vertexAttribPointer(shaderProgram.vPosition, 4, gl.FLOAT, false,4*(6),0);
	gl.vertexAttribPointer(shaderProgram.a_texCoord, 2, gl.FLOAT, false,4*(6),4*4);
	
	var model= mat4.ortho(-targetwidth/2,  targetwidth/2, targetheight/2, -targetheight/2,-1.0,1.0);
	var trans=mat4.create();
	mat4.translate(model, [-centerx, -centery, 0.0]);
	gl.uniformMatrix4fv(shaderProgram.uMVPMatrix, false, model);
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	height++;
}

function webGLStart() {
	var canvas = document.getElementById("canvas");
	canvas.addEventListener("mousedown", mouseDown, false);
	initGL(canvas);
	initShaders();
	initBuffers();
	initTextures();
	setInterval(drawScene, 15);
}

var mouseDown=function(e) {
    var rect = canvas.getBoundingClientRect();
    var x=e.clientX - rect.left;
    var y=e.clientY - rect.top;
    game.mclick(x/2, y/2);
    return false;
}

function Numbers(){}
Numbers.draw = function(s,x,y,type){
	s=s.toString();
	if (type==0){
		//console.log(s+":"+s.charAt(n));
		for (var n=0;n<s.length;n++){
			sheet.drawSheet(x,y,x+6,y+8,parseInt(s.charAt(n))+10);
			x+=8;
			//console.log(s.charAt(n));
		}
	}
	else if (type==1){
		for (var n=0;n<s.length;n++){
			sheet.drawSheet(x,y,x+14,y+22,parseInt(s.charAt(n))+20);
			x+=16;
		}
	}
}