
/* Global functions */
/* Use array.clear */
Array.prototype.clear = function() {
    this.splice(0, this.length);
};

/* This is server side code */
var isDrawing;
var lineWidthS = 10;
var lineStrokeStyleS = 'rgba(0, 100, 0, 0.25)';

/* Lets define the data structures for sending data to server */
var SpointX1, SpointY1;
var SpointX2 = [], SpointY2 = [];   

function doTouchStart(evt) {
    var serverCanvasOffset = el.getBoundingClientRect();
  
    event.preventDefault();

    var canvas_x = event.targetTouches[0].pageX;
    var canvas_y = event.targetTouches[0].pageY;


    isDrawing = true;
    ctx.lineWidth = lineWidthS;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = lineStrokeStyleS;
    debugMsg("canvas offset" + JSON.stringify(serverCanvasOffset));
    /* This client is the brower*/
    ctx.moveTo(canvas_x - serverCanvasOffset.left, canvas_y - serverCanvasOffset.top);
    /* Add points to postData */
    SpointX1 = canvas_x - serverCanvasOffset.left;
    SpointY1 = canvas_y - serverCanvasOffset.top;
    debugMsg("Touch End: {" + SpointX1 + " " + SpointY1 + " }");
}

function doTouchEnd(evt) {
    var serverCanvasOffset = el.getBoundingClientRect();
  
    event.preventDefault();
    isDrawing = false;
    send_data_to_server(SpointX1, SpointY1, SpointX2, SpointY2);
    SpointX2.clear();
    SpointY2.clear();
    debugMsg("Touch End");
}

function doTouchMove(evt) {
    var serverCanvasOffset = el.getBoundingClientRect();
    ctx.strokeStyle = lineStrokeStyleS;
    event.preventDefault();

    var canvas_x = event.targetTouches[0].pageX;
    var canvas_y = event.targetTouches[0].pageY;
    
    if (isDrawing) {
      ctx.lineTo(canvas_x - serverCanvasOffset.left, canvas_y - serverCanvasOffset.top);
      ctx.stroke();
      /* Add points to postData */
      if (SpointX2.length > 0) {
        tempX = SpointX2.pop();
        tempY = SpointY2.pop();
        if ((tempX == (canvas_x - serverCanvasOffset.left)) && (tempY == (canvas_y - serverCanvasOffset.top))) {
            debugMsg("Already Added this point, hence ignore");
            return;
        } else {
          SpointX2.push(tempX);
          SpointY2.push(tempY);
        }
      }
      SpointX2.push(canvas_x - serverCanvasOffset.left);
      SpointY2.push(canvas_y - serverCanvasOffset.top);
      debugMsg("Touch Move : X2= " + SpointX2  + " Y2= " + SpointY2+ "");
    }
}

function onmousedown(e) {
  var serverCanvasOffset = el.getBoundingClientRect();

  isDrawing = true;
  ctx.lineWidth = 10;
  ctx.lineJoin = ctx.lineCap = 'round';
  debugMsg("canvas offset" + JSON.stringify(serverCanvasOffset));
  /* This client is the brower*/
  ctx.moveTo(e.clientX - serverCanvasOffset.left, e.clientY - serverCanvasOffset.top);
  /* Add points to postData */
  SpointX1 = e.clientX - serverCanvasOffset.left;
  SpointY1 = e.clientY - serverCanvasOffset.top;
  debugMsg("mouse Down : {" + SpointX1 + " " + SpointY1 + " }");
}

function onmousemove(e) {
  var serverCanvasOffset = el.getBoundingClientRect();

  if (isDrawing) {
    ctx.lineTo(e.clientX - serverCanvasOffset.left, e.clientY - serverCanvasOffset.top);
    ctx.stroke();
    /* Add points to postData */
    if (SpointX2.length > 0) {
        tempX = SpointX2.pop();
        tempY = SpointY2.pop();
        if ((tempX == (e.clientX - serverCanvasOffset.left)) && (tempY == (e.clientY - serverCanvasOffset.top))) {
            debugMsg("Already Added this point, hence ignore");
            return;
        } else {
          SpointX2.push(tempX);
          SpointY2.push(tempY);
        }
    }
    SpointX2.push(e.clientX - serverCanvasOffset.left);
    SpointY2.push(e.clientY - serverCanvasOffset.top);
    debugMsg("mouse Move : X2= " + SpointX2  + " Y2= " + SpointY2+ "");
  }
}

function onmouseup(e) {
  isDrawing = false;
  send_data_to_server(SpointX1, SpointY1, SpointX2, SpointY2);
  SpointX2.clear();
  SpointY2.clear();
  debugMsg("mouse up");
}

var enable_debug = 1;
var imgUrl = "/background.png"
function debugMsg(msg) {
    console.log("Debug :" + msg);
}
/* Code to send the stroke data to server */
function send_data_to_server(SpointX1, SpointY1, SpointX2, SpointY2) {
    var postData = new Object();

    postData.imgUrl = slideUrl;
    postData.pointX1 = SpointX1;
    postData.pointY1 = SpointY1;
    postData.pointX2 = new Array();
    postData.pointY2 = new Array();

    //SpointX2.reverse();
    //SpointY2.reverse();
    while(SpointX2.length != 0) {
        postData.pointX2.push(SpointX2.pop())
        postData.pointY2.push(SpointY2.pop());
    }

    console.log("Sending: " + JSON.stringify(postData));

    $.ajax({
        type: 'POST',
        url: '/serverData',
        data: JSON.stringify(postData),
        async : 'true',
        dataType : 'json',
        contentType : 'application/json',
        timeout : 5000,
        success: function(data) {
            console.log("Data sent to the server");
        },
        error: function(err) {
            //console.log("Error in sending data"+JSON.stringify(err));
        },
    }).done();

}
/* Send image url to server*/
function addSlideByServer(slideUrl) {
    var postData = new Object();
    postData.image = slideUrl;

    $.ajax({
        type: 'POST',
        url: '/addSlide',
        data: JSON.stringify(postData),
        async : 'flase',
        dataType : 'json',
        contentType : 'application/json',
        timeout : 5000,
        success: function(data) {
            console.log("Slide add to the server");
        },
        
    }).done();

}

function startClientPooling(data) {
    console.log("added the user");
    setTimeout(client_get_server_stroke, 1000);
}

var tokenId;
function joinUser(tokenId) {
    var postData = new Object();
    console.log("token " + tokenId);
    postData.id = tokenId;

    $.ajax({
        type: 'POST',
        url: '/userJoin',
        data: JSON.stringify(postData),
        async : 'flase',
        dataType : 'json',
        contentType : 'application/json',
        timeout : 5000,
        success: startClientPooling,
        error: function(err) {
            console.log("Error in sending data"+JSON.stringify(err));
        },
    }).done();
}

/* This function draws on the client canvas. pointX2/Y2 are the array of
  points and X1/Y1 are the start points */
function client_draw(pointX1, pointY1, pointX2, pointY2) {

    var tx, ty;

    ctx_client.beginPath();
    ctx_client.lineWidth = lineWidthC;
    ctx_client.strokeStyle = lineStrokeStyleC;
    ctx_client.lineJoin = ctx_client.lineCap = 'round';
    ctx_client.moveTo(pointX1, pointY1);
    while(pointX2.length > 0) {
        tx = pointX2.pop();
        ty = pointY2.pop();
        ctx_client.lineTo(tx, ty);
        ctx_client.stroke();
    }
}

/* Ajax Success call back for client GET on /data */
function client_got_data_cb(data) {
  var pointX1, pointY1;
  var pointX2 = []; pointY2 = [];

  console.log("Client Data : " + JSON.stringify(data));
  /* Lets fix the json format of data:
    {"pointX1":10,"pointY1":20, "pointX2":[10,20,20,30], "pointY2" : [11,20,33,50]}
    We assume that the lenght of pointX2 and pointY2 is same */
  try {
  for (var i = 0; i < data.points.length; i++) {
        console.log("GET data: " + JSON.stringify(data));
        pointX1 = data.points[i].X1;
        pointY1 = data.points[i].Y1;
        while(data.points[i].X2.length != 0) {
          pointX2.push(data.points[i].X2.pop());
          pointY2.push(data.points[i].Y2.pop());
        }
        /* We got the complete stroke. Let's draw it */
        client_draw(pointX1, pointY1, pointX2, pointY2);
    }
  } catch(err) {

  }
  timeout = setTimeout(client_get_server_stroke, 500);
}

/* Do an ajax call to get the data */
function client_get_server_stroke() {
  var data = new Object();
  data.id = tokenId;
  /* Let's not waste memory. Clear the previous timeout*/
  clearTimeout(timeout);
  $.ajax({
      type: 'POST',
      url: '/serverDataForClient',
      data: data,
      async : 'false',
      dataType : 'json',
            cache: false,
      timeout : 5000,
      success : client_got_data_cb,
      error: function() {
        console.log("Error in client get /serverData");
        timeout = setTimeout(client_get_server_stroke, 1000);
      }
    }).done();
}

function getClientTokenId() {

  $.ajax({
      type: 'GET',
      url: '/getClientSessionToken',
      async : 'false',
      dataType : 'json',
            cache: false,
      timeout : 5000,
      success : function(data) {
          console.log("Got New Token" + JSON.stringify(data));
          tokenId = data.tokenid;
          console.log("Token id " + tokenId);
          joinUser(tokenId);
          return;
      },
      error: function() {
        console.log("Error in client get /serverData");
      }
    }).done();
}

/* Common initilizations */
function init() {
  console.log("init");
  /* First we will initilize the server timer. Initially we will send the
    the periodic data to server with interval = 500miliseconds */
    init_server();
    /* Let receive the data twice the frequeny as server. If it don't work
    then fine tune the frequency */
    init_client();  

}
slideUrl = "./images/1.png";

/* This is server side code */
var el;
var ctx;
function init_server(serverCanvasId) {
    /* This is server side code */
    el = document.getElementById(serverCanvasId);
    ctx = el.getContext('2d');

    /* Touch event handlers, we need to handle more events */
    el.addEventListener("touchstart", doTouchStart, false);
    el.addEventListener("touchend", doTouchEnd, false);
    el.addEventListener("touchmove", doTouchMove, false);
    
    el.addEventListener("mousemove", onmousemove, false); 
    el.addEventListener("mouseup", onmouseup, false);
    el.addEventListener("mousedown", onmousedown, false);
    
    addSlideByServer(slideUrl);
    console.log("Init Server Done");
}

var timeout;
function startClient() {
    debugMsg("Starting Clinet");
    getClientTokenId();
}

/* This is client side code */
var el_client;
var ctx_client;
var clientCanvasOffset;
var lineWidthC = 10;
var lineStrokeStyleC = 'rgba(0, 100, 0, 0.25)';
function init_client(clientCanvasId) {
    el_client = document.getElementById(clientCanvasId);
    ctx_client = el_client.getContext('2d');
    clientCanvasOffset = $(clientCanvasId).offset();
    console.log("Client offset " + clientCanvasOffset);
    startClient();
}

/*var slideUrl = "/images/background.png";
$(document).ready(function() {
    var contextS = document.getElementById('c').getContext("2d");
    var contextC = document.getElementById('client').getContext("2d");
    var img = new Image();
    img.onload = function () {
        contextS.drawImage(img, 0, 0, 800, 500);
        contextC.drawImage(img, 0, 0, 800, 500);
    }
    img.src= slideUrl;
    init();
});

*/