
var express = require('express');
var app = express(), bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var httpServer = http.Server(app);

console.log("dir name: ",__dirname);
app.use(express.static(__dirname+'/www'));



app.get('/', function(req, res){
    res.sendfile(__dirname + '/www/index.html');
});

app.get('/hi', function(req, res) {
	console.log("hi");
});

var x = [], y = [], tx = [], ty = [];
var idx;
app.post('/data', function(req, resp){

	console.log(JSON.stringify(req.body));
	x[idx] = req.body.x;
	y[idx] = req.body.y;
	tx[idx] = req.body.tx;
	ty[idx] = req.body.ty;
	idx++;
	resp.writeHead(200);
	resp.write('{"success":0}');
	resp.end();

});

app.get('/data', function(req, resq) {
	console.log("Sending x and y");
	resq.writeHead(200);

	if (idx != 0 ) {
		var data1= new Object();
		data1.x = x[idx - 1];
		data1.y = y[idx - 1];
		data1.tx = tx;[idx - 1]
		data1.ty = ty[idx - 1];
		idx--;
		console.log("sending : " + JSON.stringify(data1));
		resq.write(JSON.stringify(data1));
	} else {
		resq.write("{'data':'no data'");
	}

	resq.end();
});

app.listen((process.env.PORT || 5000));
