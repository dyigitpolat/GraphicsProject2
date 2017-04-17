
var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var cylinderVertices = [];

var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;


var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 3.0;
var lowerArmHeight = 2.0;
var upperArmWidth  = 0.5;
var lowerArmWidth  = 0.5;
var upperLegWidth  = 0.5;
var lowerLegWidth  = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var numNodes = 10;
var numAngles = 11;
var angle = 0;

var curTranslateX;
var curTranslateY;
var curTranslateZ;
var curtheta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

var TranslateX;
var TranslateY;
var TranslateZ;
var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

var TranslateX2;
var TranslateZ2;
var theta2 = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];


var thetaList = [];
var transList = [];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

function fillLists()
{
  thetaList =
  [
    [90, 20, 100, -80, 240, -60, 100, 90, 240, 0, 0],
    [0, 10, 260, -60, 120, -80, 260, 0, 120, 90, 0],
    [0, 20, 100, -80, 240, -60, 100, 90, 240, 0, 0],
    [90, 10, 260, -60, 120, -80, 260, 0, 120, 90, 0],
  ];

  transList =
  [
    [0, 0.5, -1],
    [0, 0, -1],
    [0, 0.5, -1],
    [0, 0, -1]
  ]

}

function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}


function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:


    m = translate( curTranslateX, curTranslateY, curTranslateZ);
    m = mult( m, translate( curTranslateX,0.0,0.0));
    m = mult( m, rotate(curtheta[torsoId], 0, 1, 0 ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


    m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	  m = mult(m, rotate(curtheta[head1Id], 1, 0, 0))
	  m = mult(m, rotate(curtheta[head2Id], 0, 1, 0));
    m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperArmId, null);
    break;


    case leftUpperArmId:

    m = translate(-(torsoWidth+upperArmWidth)/2, 0.9*torsoHeight, 0.0);
	  m = mult(m, rotate(curtheta[leftUpperArmId], 1, 0, 0));
	  m = mult(m, rotate(15, 0, 0, 1));
    figure[leftUpperArmId] = createNode( m, leftUpperArm, rightUpperArmId, leftLowerArmId );
    break;

    case rightUpperArmId:

    m = translate((torsoWidth+upperArmWidth)/2, 0.9*torsoHeight, 0.0);
	  m = mult(m, rotate(curtheta[rightUpperArmId], 1, 0, 0));
	  m = mult(m, rotate(-15, 0, 0, 1));
    figure[rightUpperArmId] = createNode( m, rightUpperArm, leftUpperLegId, rightLowerArmId );
    break;

    case leftUpperLegId:

    m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
    m = mult(m , rotate(curtheta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
    m = mult(m, rotate(curtheta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(curtheta[leftLowerArmId], 1, 0, 0));
	  m = mult(m, rotate(-15, 0, 0, 1));
    figure[leftLowerArmId] = createNode( m, leftLowerArm, null, null );
    break;

    case rightLowerArmId:

    m = translate(0.0, upperArmHeight, 0.0);
    m = mult(m, rotate(curtheta[rightLowerArmId], 1, 0, 0));
	  m = mult(m, rotate(15, 0, 0, 1));
    figure[rightLowerArmId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(curtheta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(curtheta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }

}

function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function leftLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function rightUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperArmWidth, upperArmHeight, upperArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    //for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    drawCylinder();
}

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


var circlePoints = 0;
function bottomCircle()
{
  for( var i = 0; i < circlePoints; i++)
  {
    pointsArray.push(cylinderVertices[i]);
  }
}

function tube()
{
  for( var i = 0; i < circlePoints; i++)
  {
    pointsArray.push(cylinderVertices[i]);
    pointsArray.push(cylinderVertices[circlePoints + i]);
  }

  pointsArray.push(cylinderVertices[0]);
  pointsArray.push(cylinderVertices[circlePoints]);

}

function topCircle()
{
  for( var i = 0; i < circlePoints; i++)
  {
    pointsArray.push(cylinderVertices[circlePoints + i]);
  }
}

function drawCylinder()
{
  gl.drawArrays(gl.TRIANGLE_FAN, 0, circlePoints);
  gl.drawArrays(gl.TRIANGLE_STRIP, circlePoints, 2*circlePoints + 2);
  gl.drawArrays(gl.TRIANGLE_FAN, 3*circlePoints + 2, circlePoints);
  gl.drawArrays(gl.TRIANGLE_STRIP, 4*circlePoints + 2, capsuleRows*circlePoints);
  gl.drawArrays(gl.TRIANGLE_STRIP, (4+2*capsuleRows)*circlePoints + 2, capsuleRows*circlePoints);

}

var capsuleRows;
function createCapsuleTop()
{
  var i;
  var j;
  capsuleRows = 0;
  for( i = 0; i < Math.PI / 2; i+= 0.3)
  {
    for( j = 0; j < 2*Math.PI; j+= 0.3)
    {
      cylinderVertices.push( vec4( 0.5*Math.cos(j)*Math.cos(i), 0.5 + Math.sin(i)*0.1, 0.5*Math.sin(j)*Math.cos(i), 1.0) );
    }
    capsuleRows++;
  }

  cylinderVertices.push( vec4( 0, 1, 0, 1.0) );

}

function createCapsuleBottom()
{
  var i;
  var j;
  for( i = 0; i < Math.PI / 2; i+= 0.3)
  {
    for( j = 0; j < 2*Math.PI; j+= 0.3)
    {
      cylinderVertices.push( vec4( 0.5*Math.cos(j)*Math.cos(i), -0.5 - Math.sin(i)*0.1, 0.5*Math.sin(j)*Math.cos(i), 1.0) );
    }
  }

  cylinderVertices.push( vec4( 0, -1, 0, 1.0) );
}

function capsulePoints()
{
  var i;
  var j;
  var base = 2*circlePoints;
  for( i = 1; i < capsuleRows; i++)
  {
    for( j = 0; j < circlePoints; j++)
    {
      pointsArray.push(cylinderVertices[base + i*circlePoints + j]);
      pointsArray.push(cylinderVertices[base + j]);
    }
  }


  for( j = 0; j < circlePoints; j++)
  {
    pointsArray.push(cylinderVertices[base + j]);
    pointsArray.push(cylinderVertices[base + capsuleRows*circlePoints]);
  }

  base = base + capsuleRows*circlePoints + 1;

  for( i = 1; i < capsuleRows; i++)
  {
    for( j = 0; j < circlePoints; j++)
    {
      pointsArray.push(cylinderVertices[base + i*circlePoints + j]);
      pointsArray.push(cylinderVertices[base + j]);
    }
  }

  for( j = 0; j < circlePoints; j++)
  {
    pointsArray.push(cylinderVertices[base + j]);
    pointsArray.push(cylinderVertices[base + capsuleRows*circlePoints]);
  }

}

function createCylinder()
{
  //
  for( t = 0; t < 2*Math.PI; t += 0.3)
  {
    cylinderVertices.push( vec4( 0.5*Math.cos(t), -0.5, 0.5*Math.sin(t), 1.0) );
    circlePoints++;
  }

  for( t = 0; t < 2*Math.PI; t += 0.3)
  {
    cylinderVertices.push( vec4( 0.5*Math.cos(t), 0.5, 0.5*Math.sin(t), 1.0) );
  }
  //
}

//////////////////////////////////////////
var mouseP = [0, 0];
function initEventHandlers(canvas, mousePosition)
 {
   var lastX = -1;
   var lastY = -1;
   var dragging = false;

   canvas.onmousedown = function(ev) {  //Mouse is pressed
     var x = ev.offsetX;
     var y = ev.offsetY;

     alert( "mouse at: " + x + ", " + y);

     var rect = ev.target.getBoundingClientRect();
     if(rect.left <= x
         && x <= rect.right
         && rect.top <= y
         && y <= rect.bottom
       ) {
       lastX = x;
       lastY = y;
       mousePosition[0] = x;
       mousePosition[1] = canvas.height - y;
       dragging = true;
     }
   };

   canvas.onmouseup = function(ev){ //Mouse is released
     dragging = false;
   }

   canvas.onmousemove = function(ev) { //Mouse is moved
     var x = ev.offsetX;
     var y = ev.offsetY;
     if(dragging) {
       //put some kind of dragging logic in here
       //Here is a roation example
       var factor = 100/canvas.height;
       var dx = factor * (x - lastX);
       var dy = factor * (y - lastY);
       //Limit x-axis roation angle to -90 to 90 degrees
       //currentAngle[0] = Math.max(Math.min(currentAngle[0] + dy, 90), -90);
       //currentAngle[1] = currentAngle[1] + dx;

       mousePosition[0] = x;
       mousePosition[1] = canvas.height - y;

     }
     lastX = x;
     lastY = y;

   }
 }

///////////////////////////////////////////




var timet;
var timetLoc;
var isRunning = false;
window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    initEventHandlers( canvas, mouseP );

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.1, 0.0, 0.1, 1.0 );
      gl.enable(gl.DEPTH_TEST);
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();
    timet = 0;
    TranslateZ = 0;
    TranslateX = 0;

    //fillLists();
    //thetaList.push(theta.slice());
    //thetaList.push(theta.slice());
    //transList.push( [0,0,0]);
    //transList.push( [0,0,0]);

    //projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    projectionMatrix = perspective( 90, 1, 0.03, 200);
    modelViewMatrix = lookAt( vec3(0,3,-10), vec3(0,2,0), vec3(0,1,0));
    //modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    timetLoc = gl.getUniformLocation(program, "timet");

    //cube();
    createCylinder();
    createCapsuleTop();
    createCapsuleBottom();
    bottomCircle();
    tube();
    topCircle();
    capsulePoints();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

        document.getElementById("slider0").onchange = function() {

        isRunning = false;
        theta[torsoId ] = event.srcElement.value;
        initNodes(torsoId);
    };
        document.getElementById("slider1").onchange = function() {
        isRunning = false;
        theta[head1Id] = event.srcElement.value;
        initNodes(head1Id);
    };

    document.getElementById("slider2").onchange = function() {
         isRunning = false;
         theta[leftUpperArmId] = event.srcElement.value;
         initNodes(leftUpperArmId);
    };
    document.getElementById("slider3").onchange = function() {

         isRunning = false;
         theta[leftLowerArmId] =  event.srcElement.value;
         initNodes(leftLowerArmId);
    };

        document.getElementById("slider4").onchange = function() {
        isRunning = false;
        theta[rightUpperArmId] = event.srcElement.value;
        initNodes(rightUpperArmId);
    };
    document.getElementById("slider5").onchange = function() {
         isRunning = false;
         theta[rightLowerArmId] =  event.srcElement.value;
         initNodes(rightLowerArmId);
    };
        document.getElementById("slider6").onchange = function() {
        isRunning = false;
        theta[leftUpperLegId] = event.srcElement.value;
        initNodes(leftUpperLegId);
    };
    document.getElementById("slider7").onchange = function() {
         isRunning = false;
         theta[leftLowerLegId] = event.srcElement.value;
         initNodes(leftLowerLegId);
    };
    document.getElementById("slider8").onchange = function() {
         isRunning = false;
         theta[rightUpperLegId] =  event.srcElement.value;
         initNodes(rightUpperLegId);
    };
        document.getElementById("slider9").onchange = function() {
        isRunning = false;
        theta[rightLowerLegId] = event.srcElement.value;
        initNodes(rightLowerLegId);
    };
    document.getElementById("slider10").onchange = function() {

         isRunning = false;
         theta[head2Id] = event.srcElement.value;
         initNodes(head2Id);
    };

    document.getElementById("sliderTx").onchange = function() {
      isRunning = false;
      TranslateX = event.srcElement.value;
      initNodes(torsoId);
    };

    document.getElementById("sliderTy").onchange = function() {
      isRunning = false;
      TranslateY = event.srcElement.value;
      initNodes(torsoId);
    };

    document.getElementById("sliderTz").onchange = function()
    {
        isRunning = false;
        TranslateZ = event.srcElement.value;
        initNodes(torsoId);
    };

    document.getElementById("addkeyf").onclick = function()
    {

        thetaList.push( theta.slice());
        transList.push( [ TranslateX, 0, TranslateZ]);
        for(i=0; i<numNodes; i++) initNodes(i);
        isRunning = true;
    };

    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}


var interpolationFrame = 0;
var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    if( isRunning)
    {
      if(timet < 1){
        timet += 0.01;
      }
      else {
        //next keyframe
        interpolationFrame = (interpolationFrame + 1) % thetaList.length;
        timet = 0;
      }

      var curFrame = interpolationFrame;
      var nextFrame = (interpolationFrame + 1) % thetaList.length;

      for( var i = 0; i < theta2.length; i++)
      {
        curtheta[i] = thetaList[curFrame][i]*(1-timet) + thetaList[nextFrame][i]*timet;
        initNodes(i);
      }

      curTranslateX = transList[curFrame][0]*(1-timet) + transList[nextFrame][0]*timet;
      curTranslateY = transList[curFrame][1]*(1-timet) + transList[nextFrame][1]*timet;
      curTranslateZ = transList[curFrame][2]*(1-timet) + transList[nextFrame][2]*timet;
      initNodes(torsoId);
    }
    else
    {
      for( var i = 0; i < theta2.length; i++)
      {
        curtheta[i] = theta[i];
        initNodes(i);
      }

      curTranslateX = TranslateX;
      curTranslateY = TranslateY;
      curTranslateZ = TranslateZ;
      initNodes(torsoId);
    }

    gl.uniform1f(timetLoc, timet);
    traverse(torsoId);
    requestAnimFrame(render);

}
//source website http://listjs.com/examples/add-get-remove/
