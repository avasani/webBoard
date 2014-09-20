var express = require('express');
var app = express(), bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var requestHandlers = require("./requestHandler");
var httpServer = http.Server(app);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/fonts", express.static(__dirname + '/fonts'));

/* Send the index file for "/" */ 
app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
    //requestHandlers.start(res);
});

app.get('/start', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.start(res);
});

app.post('/upload', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.upload(req, res);
});

app.get('/show', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.show(req, res);
});

app.listen(3000);
