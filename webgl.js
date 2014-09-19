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
          alert(gl.getShaderInfoLog(shader));
          return null;
      }

      return shader;
  }

if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
    return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame;
  } )();
};

var main=function() {
  
  var CANVAS=document.getElementById("your_canvas");
  
  CANVAS.width=window.innerWidth;
  CANVAS.height=window.innerHeight;
  
  /*========================= GET WEBGL CONTEXT ========================= */
  try {
    var GL = CANVAS.getContext("experimental-webgl", {antialias: true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  } ;
  
  /*========================= SHADERS ========================= */
  /*
  var shader_vertex_source="\n\
attribute vec2 position; //the position of the point\n\
attribute vec3 color;  //the color of the point\n\
\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = vec4(position, 0., 1.); //0. is the z, and 1 is w\n\
vColor=color;\n\
}";
  
  
  var shader_fragment_source="\n\
precision mediump float;\n\
\n\
\n\
\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";
*/
  
  
  var get_shader=function(source, type, typeString) {
    return getShader(GL,source);
  };
  
  
  
  var shader_vertex=get_shader("shader-fs", GL.VERTEX_SHADER, "VERTEX");
  
  var shader_fragment=get_shader("shader-vs", GL.FRAGMENT_SHADER, "FRAGMENT");
  
  var SHADER_PROGRAM=GL.createProgram();
  GL.attachShader(SHADER_PROGRAM, shader_vertex);
  GL.attachShader(SHADER_PROGRAM, shader_fragment);
  
  GL.linkProgram(SHADER_PROGRAM);
  
  var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
  var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");
  
  GL.enableVertexAttribArray(_color);
  GL.enableVertexAttribArray(_position);
  
  GL.useProgram(SHADER_PROGRAM);
  
  
  /*========================= THE TRIANGLE ========================= */
  //POINTS :
  var triangle_vertex=[
    -1,-1, //first summit -> bottom left of the viewport
    0,0,1,
    1,-1, //bottom right of the viewport
    1,1,0,
    0,.5,  //top right of the viewport
    1,0,1
  ];
  
  var TRIANGLE_VERTEX= GL.createBuffer ();
  GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
  GL.bufferData(GL.ARRAY_BUFFER,
                new Float32Array(triangle_vertex),
                GL.STATIC_DRAW);
  
  //FACES :
  var triangle_faces = [0,1,2];
  var TRIANGLE_FACES= GL.createBuffer ();
  GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
  GL.bufferData(GL.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(triangle_faces),
                GL.STATIC_DRAW);
  
  
  
  /*========================= DRAWING ========================= */
  GL.clearColor(0.0, 0.0, 0.0, 0.0);
  
  var animate=function() {
    
    GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
    GL.clear(GL.COLOR_BUFFER_BIT);
    
    GL.vertexAttribPointer(_position, 2, GL.FLOAT, false,4*(2+3),0) ;
    GL.vertexAttribPointer(_color, 3, GL.FLOAT, false,4*(2+3),2*4) ;
    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, TRIANGLE_FACES);
    GL.drawElements(GL.TRIANGLES, 3, GL.UNSIGNED_SHORT, 0);
    GL.flush();
    
    window.requestAnimationFrame(animate);
  }
  
  animate();
}