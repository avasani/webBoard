
var express = require('express');
var app = express(), bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var httpServer = http.Server(app);
app.set('port', (process.env.PORT || 5000))

console.log("dir name: ",__dirname);
app.use(express.static(__dirname+'/www'));



app.get('/', function(req, res){
    res.sendfile(__dirname + '/www/index.html');
});

app.get('/hi', function(req, res) {
	console.log("hi");
});

var x, y, tx, ty;
app.post('/data', function(req, resp){

	console.log(JSON.stringify(req.body));
	x = req.body.x;
	y = req.body.y;
	tx = req.body.tx;
	ty = req.body.ty;
	resp.writeHead(200);
	resp.write('{"success":0}');
	resp.end();

});

app.get('/data', function(req, resq) {
	console.log("Sending x and y");
	resq.writeHead(200);

	var data1= new Object();
	data1.x = x;
	data1.y = y;
	data1.tx = tx;
	data1.ty = ty;
	console.log("sending : " + JSON.stringify(data1));
	resq.write(JSON.stringify(data1));
	resq.end();
});

