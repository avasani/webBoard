var querystring = require("querystring");
var formidable = require("formidable");
var fs = require("fs");
var exec = require('child_process').exec;
var spindrift = require('spindrift');
var instructorhtml;
var PDFDocument = require('pdfkit');
var pdfutils = require('pdfutils').pdfutils;

fs.readFile('./instructor-webboard.html', function(err, html) {
    if (err) {
        throw err;
    }
    instructorhtml = html;
});



function start(response) {
    console.log("Request handler start was called.");
    var body = "<html>" +
        "<head>" +
        "<meta http-equiv='Content-Type' content='text/html'; " +
        "charset='UTF-8' />" +
        "</head>" +
        "<body>" +
        "<form action='/upload' enctype='multipart/form-data' method='post'>" +
        "<input type='file' name='upload'></input>" +
        "<input type='submit' value='Upload file' />" +
        "</form>" +
        "</body>" +
        "</html>";
    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(instructorhtml);
    response.end();
}

function upload(response, request) {
    console.log("Request handler upload was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function(error, fields, files) {
        console.log("parsing done");
        /* possible error on windows systems :
 tried to rename to an already existing file */
        fs.rename(files.upload.path, "c:\\tmp\\test.pdf", function(err) {
            if (err) {
                fs.unlink("c:\\tmp\\test.pdf");
                console.log("Value of files.upload.path : " + files.upload.path);
                fs.rename(files.upload.path, "c:\\tmp\\test.pdf");
            }
        });
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write("Received pdf: <br/>");
        //response.write("<a href="/show">"/show"</a>");
        response.end();
    });
}

function show(res, req) {
    console.log("Request handler show was called.");
    // var pdf = spindrift('c:\\tmp\\test.pdf');
    // pdf.pngStream(300).pipe(fs.createWriteStream('out-page1.png'));
    // fs.readFile("c:\\tmp\\test.pdf","binary", function(error,file)
    // {
    // if (error)
    // {
    // response.writeHead(500, {"Content-Type": "text/plain" });
    // response.write(error + "\n");
    // response.end();
    // }
    // else
    // {
    // response.writeHead(200, {"Content-Type" : "application/png" });
    // response.write(file, "binary" );
    // response.end();
    // }
    // });
    // var doc = new PDFDocument('ok.pdf');

    // var range = doc.bufferedPageRange();

    // console.log(range.start+" ***  "+range.count);

    pdfutils("ok.pdf",function(err,doc){
//doc[0].asPNG({MaxWidth:500, MaxHeight: 500}).toFile("out.png");


for(var i=1;i<doc.length;i++){
    exec("/usr/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=jpeg -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage="+i+" -dLastPage="+i+" -sOutputFile=out"+i+".png ok.pdf", function(error, stdout, stderr) {
        console.log("Request handler show was called.");
        if (error !== null) {
            console.log("Request handler show was called.");
            console.log(error);
        } else {
            var img = fs.readFileSync('out'+i+'.png');
            res.writeHead(200, {
                'Content-Type': 'image/png'
            });
            res.end(img, 'binary');
            console.log('Created PNG: out'+i+'.png');
        }
    });
}
});

    // exec("/usr/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=jpeg -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=1 -dLastPage=1 -sOutputFile=out.png ok.pdf", function(error, stdout, stderr) {
    //     console.log("Request handler show was called.");
    //     if (error !== null) {
    //         console.log("Request handler show was called.");
    //         console.log(error);
    //     } else {
    //         var img = fs.readFileSync('out.png');
    //         res.writeHead(200, {
    //             'Content-Type': 'image/png'
    //         });
    //         res.end(img, 'binary');
    //         console.log('Created PNG: out.png');
    //     }
    // });
    

}
exports.start = start;
exports.upload = upload;
exports.show = show;
