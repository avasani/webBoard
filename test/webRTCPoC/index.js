
var express = require('express');
var app = express(), bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var httpServer = http.Server(app);

app.use("/images", express.static(__dirname + '/www/images'));

console.log("dir name: ",__dirname);
app.use(express.static(__dirname+'/www'));

/* Send the index file for "/" */ 
app.get('/', function(req, res){
    res.sendfile(__dirname + '/www/index.html');
});


var pointX1, pointY1;
var pointX2 = [], pointY2 = [];

Array.prototype.clear = function() {
    this.splice(0, this.length);
};

app.post('/serverData', function(request, response){

	console.log(JSON.stringify(request.body));
	pointX1 = request.body.pointX1;
	pointY1 = request.body.pointY1;
	while (request.body.pointX2.length != 0) {
		pointX2.push(request.body.pointX2.pop());
		pointY2.push(request.body.pointY2.pop());
	}

	response.writeHead(200);
	response.write('{"success":0}');
	response.end();

});

app.get('/serverData', function(request, response) {

	if (pointX2.length == 0 ) {
		/* Lets send error message if data is not available*/
		console.log("No data to send. Send 404 then :P");
		response.writeHead(404);
		response.end();
		return;		
	}

	var sendData = new Object();

    sendData.pointX1 = pointX1;
    sendData.pointY1 = pointY1;
    sendData.pointX2 = new Array();
    sendData.pointY2 = new Array();
    while (pointX2.length != 0) {
		sendData.pointX2.push(pointX2.pop());
		sendData.pointY2.push(pointY2.pop());
	}

	response.writeHead(200);
	response.write(JSON.stringify(sendData));
	response.end();

    console.log("Sent: " + JSON.stringify(sendData));
    pointX2.clear();
    pointY2.clear();
});

app.listen(((process.env.PORT || 5000)));
//app.listen(3000);