var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var requestHandlers = require("./requestHandler");
var webBoard = require("./nodeWebBoard");
var httpServer = http.Server(app);

app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/images", express.static(__dirname + '/images'));
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


app.post('/upload', function(req, res) {
    console.log("POST");
    requestHandlers.upload(req, res);
});

app.get('/show', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    requestHandlers.show(req, res);
});

var sessionURL = null;
app.post('/sessionURL', function(req, res){
		sessionURL=req.body.sessionURL;
        console.log("Saving :" + sessionURL);
		res.writeHead(200);
		res.write("{'success':0}");
		res.end();
});

app.get('/studentLogin', function(req, res) {
        res.sendfile(__dirname + '/student-webboard.html');
});

app.get('/student', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    var getData = new Object();
    getData.sessionURL = sessionURL;
    res.writeHead(200);
	res.write(JSON.stringify(getData));
	res.end();
});

app.get('/dirPath', function(req, res){
    //res.sendfile(__dirname + '/www/index.html');
    console.log("dirPath");
    requestHandlers.dirPath(req, res);
});

/* WebBoard Calls */
app.post('/addSlide', function(request, response) {
    webBoard.addSlide(request, response);
});

app.post('/startSession', function(request, response) {
    webBoard.startSession(request, response);
});

app.post('/endSession', function(request, response) {
    webBoard.endSession(request, response);
});

app.post('/serverData', function(request, response) {
    console.log("Data From Client" + JSON.stringify(request.body));
    webBoard.serverData(request, response);
});

app.post('/userJoin', function(request, response) {
    webBoard.userJoin(request, response);
});

app.get('/getClientSessionToken', function(request, response) {
    webBoard.getClientSessionToken(request, response);
});

app.post('/serverDataForClient', function(request, response) {
        webBoard.serverDataForClient(request, response);
});

app.listen(3000);
