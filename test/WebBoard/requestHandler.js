var querystring = require("querystring");
var formidable = require("formidable");
var fs = require("fs");
var exec = require('child_process').exec;
var spindrift = require('spindrift');
var instructorhtml;
var PDFDocument = require('pdfkit');
var pdfutils = require('pdfutils').pdfutils;
var mkpath = require('mkpath');
var path = require('path');
var easyimg = require('easyimage');
var util = require('util');
var multiparty = require('multiparty');
var fs1 = require('fs-extra');
var format = require('util').format;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



fs.readFile('./instructor-webboard.html', function(err, html) {
    if (err) {
        throw err;
    }
    instructorhtml = html;
});

function start(response) {
    console.log("Request handler start was called.");
    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(instructorhtml);
    response.end();
}

/* TODO: Needs to maintain the path per user */
var globalDirPath = null;

//'use strict';
function getFiles(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

function getDirectory(dir, files_) {
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_ = [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            files_.push(name);
        }
    }
    return files_;
}

function dirPath(req, res) {
    var sendData = new Object();
    //sendData.path = getDirectory("./images");
    sendData.path = globalDirPath;
    sendData.count = counter;
    console.log(">>>>>>>>>>>Sending " + sendData.path);
    res.writeHead(200);
    res.write(JSON.stringify(sendData));
    res.end();
}

function upload(req, res) {
    var target_path;
    console.log("Request handler upload was called.");
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname+'/images/';

    form.parse(req, function(error, fields, files) {

        var upload = "upload";
        console.log("parsing done");
        console.log("file size: " + JSON.stringify(files));
        var tmp_path = files.upload.path;
        console.log("/temp path"+tmp_path);

        // set where the file should actually exists - in this case it is in the "images" directory
        var filePath = files.upload.name.replace(/[^a-zA-Z.]/g,"");
        target_path = __dirname+'/images/' + filePath;
        // move the file from the temporary location to the intended location
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
            fs.unlink(tmp_path, function() {
                if (err) {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>errr");
                    return;
                }
                show(req, res, target_path);
                var dir = path.basename(target_path, '.pdf');
                globalDirPath = dir;
                var messageSend = 'File uploaded to: ' + target_path + ' - ' + files.upload.size + ' bytes';
            });
        });
    });
}

function convert(target_path, dir, ii) {
    console.log(ii);
    exec("/usr/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=jpeg -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=" + ii + " -dLastPage=" + ii + " -sOutputFile=./images/" + dir + "/out" + ii + ".jpeg " + target_path, function(error, stdout, stderr) {
        console.log("Request handler show was called.");
        if (error !== null) {
            console.log("Request handler show was called.");
            console.log(error);
        } else {
            var src = './images/' + dir + '/out' + ii + '.jpeg ';
            console.log(src);
            easyimg.resize({
                src: src,
                dst: src,
                width: 600,
                height: 600
            }, function(err, stdout, stderr) {
                if (err) throw err;
                console.log('Resized to 640x480');
            });

            console.log('Created PNG ./images/' + dir + '/out' + ii + '.jpeg');
        }
    });

    console.log("exit");
    counter++;
}

var counter = 0;


function show(req, res, target_path) {
    console.log("Request handler show was called.");
    console.log(target_path);
    var dir = path.basename(target_path, '.pdf');
    mkpath('./images/' + dir, function(err) {
        if (err) throw err;
        console.log('Directory structure ' + './images/' + dir + ' created');
    });

    pdfutils(target_path, function(err, doc) {
        console.log("%" + doc.length);
        for (var i = 1; i <= doc.length; i++) {
            console.log(i + " ####### " + doc.length);
            convert(target_path, dir, i);

        }

    });
}
exports.start = start;
exports.upload = upload;
exports.show = show;
exports.dirPath = dirPath;
