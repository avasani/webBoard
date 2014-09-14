var express = require('express');

var app = express(), bodyParser = require('body-parser');
app.use(bodyParser());
var http = require('http');
var httpServer = http.Server(app);
var websocket = require("websocket").server;

app.use("/images", express.static(__dirname + '/www/images'));

console.log("dir name: ",__dirname);
app.use(express.static(__dirname + '/www'));

/* Send the index file for "/" */ 
app.get('/', function(req, res){
    res.sendfile(__dirname + '/record.html');
});

var webrtc_clients = [];
var webrtc_discussions = {};

var websocket_server = new websocket({
    httpServer: httpServer
});

websocket_server.on("request", function(request) {
    log_comment("new request (" + request.origin + ")");

    var connection = request.accept(null, request.origin);
    log_comment("new connection (" + connection.remoteAddress + ")");

    webrtc_clients.push(connection);
    connection.id = webrtc_clients.length - 1;

    connection.on("message", function(message) {
      log_comment("!!!!!!!!!!!!!!!!!"+message.type);
        if (message.type === "utf8") {
            log_comment("got message " + message.utf8Data);

          }else{
            g_comment("got message " + message);
          }
    });

   
});

// utility functions
function log_error(error) {
    if (error !== "Connection closed" && error !== undefined) {
        log_comment("ERROR: " + error);
    }
}

function log_comment(comment) {
    console.log((new Date()) + " " + comment);
}

app.get('/record', function(req, res){

	response.writeHead(200);
	response.write("{'success':0}");
	response.end();
});

app.post('/record1', function(request, response) {
	response.writeHead(200);
	response.write("{'success':0}");
	response.end();
});

app.listen(3000);