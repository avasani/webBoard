var http = require("http");
var url = require("url");
var connect = require('connect');


function start(route,handle)
{
 function onRequest(request, response)
 {
 var pathname = url.parse(request.url).pathname;
 console.log("Request for " + pathname + " received.");
 route(handle,pathname, response, request);
 }
 http.createServer(onRequest).listen(9999);
 console.log("Server has started.");
}
exports.start = start;






























// var http = require("http");
// var url = require("url");
// var multipart = require("multipart");
// var sys = require("sys");
// var events = require("events");
// var posix = require("posix");
// fs = require('fs');

// // fs.readFile('./index.html', function (err, html) {
// //     if (err) {
// //         throw err; 
// //     }       
// //     http.createServer(function(request, response) {  
// //         response.writeHeader(200, {"Content-Type": "text/html"});  
// //         response.write(html);  
// //         response.end();  
// //     }).listen(8000);
// // });

// var server = http.createServer(function(req, res) {
//     // Simple path-based request dispatcher
//     switch (url.parse(req.url).pathname) {
//         case '/upload':
//             upload_file(req, res);
//             break;
//         case '/':
//             fs.readFile('./instructor-webboard.html', function(err, data) {
//                 res.writeHead(200, {
//                     'Content-Type': 'text/html',
//                     'Content-Length': data.length
//                 });
//                 res.write(data);
//                 res.end();  
//             });
//             break;
//         case '/instructor-webboard.html':
//             fs.readFile('instructor-webboard.html', function(err, data) {
//                 res.writeHead(200, {
//                     'Content-Type': 'text/html',
//                     'Content-Length': data.length
//                 });
//                 res.write(data);
//                 res.end();  
//             });
//             break;
//         default:
//             show_404(req, res);
//             break;
//     }
// });

// // Server would listen on port 8000
// server.listen(8000);

// function write_chunk(request, fileDescriptor, chunk, isLast, closePromise) {
//     // Pause receiving request data (until current chunk is written)
//     request.pause();
//     // Write chunk to file
//     sys.debug("Writing chunk");
//     posix.write(fileDescriptor, chunk).addCallback(function() {
//         sys.debug("Wrote chunk");
//         // Resume receiving request data
//         request.resume();
//         // Close file if completed
//         if (isLast) {
//             sys.debug("Closing file");
//             posix.close(fileDescriptor).addCallback(function() {
//                 sys.debug("Closed file");

//                 // Emit file close promise
//                 closePromise.emitSuccess();
//             });
//         }
//     });
// }

// /*
//  * Handle file upload
//  */
// function upload_file(req, res) {
//     // Request body is binary
//     req.setBodyEncoding("binary");

//     // Handle request as multipart
//     var stream = new multipart.Stream(req);

//     // Create promise that will be used to emit event on file close
//     var closePromise = new events.Promise();

//     // Add handler for a request part received
//     stream.addListener("part", function(part) {
//         sys.debug("Received part, name = " + part.name + ", filename = " + part.filename);

//         var openPromise = null;

//         // Add handler for a request part body chunk received
//         part.addListener("body", function(chunk) {
//             // Calculate upload progress
//             var progress = (stream.bytesReceived / stream.bytesTotal * 100).toFixed(2);
//             var mb = (stream.bytesTotal / 1024 / 1024).toFixed(1);

//             sys.debug("Uploading " + mb + "mb (" + progress + "%)");

//             // Ask to open/create file (if not asked before)
//             if (openPromise == null) {
//                 sys.debug("Opening file");
//                 openPromise = posix.open("./uploads/" + part.filename, process.O_CREAT | process.O_WRONLY, 0600);
//             }

//             // Add callback to execute after file is opened
//             // If file is already open it is executed immediately
//             openPromise.addCallback(function(fileDescriptor) {
//                 // Write chunk to file
//                 write_chunk(req, fileDescriptor, chunk, (stream.bytesReceived == stream.bytesTotal), closePromise);
//             });
//         });
//     });

//     // Add handler for the request being completed
//     stream.addListener("complete", function() {
//         sys.debug("Request complete");

//         // Wait until file is closed
//         closePromise.addCallback(function() {
//             // Render response
//             res.sendHeader(200, {
//                 "Content-Type": "text/plain"
//             });
//             res.sendBody("Thanks for playing!");
//             res.finish();

//             sys.puts("\n=> Done");
//         });
//     });
// }

// /*
//  * Handles page not found error
//  */
// function show_404(req, res) {

//     res.sendHeader(404, {
//         "Content-Type": "text/plain"
//     });
//     res.sendBody("You r doing it rong!");
//     res.finish();
// }