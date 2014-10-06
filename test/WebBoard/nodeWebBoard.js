/*
 *
 * Authors  : Ashwin Vasani <akvasani@asu.edu>
 *            Ravinsingh Jain <rvjain@asu.edu>
 *            Sagar Kalburgi <skalburg@asu.edu>
 *
 * Description: Nodejs webboard handling APIs
 */

var sessions = new Array();
var sessionT = new Object();
sessionT.session = new Object();
sessionT.session.PPT_Data = new Array();
sessionT.session.endSession = 0;
sessions.push(sessionT);

Array.prototype.clear = function() {
    this.splice(0, this.length);
};

exports.addSlide = addSlide;
function addSlide(request, response) {

	console.log("Add Slide :" + JSON.stringify(request.body));
	var idx = -1;
	try{
			var image_meta_data = new Object();
			image_meta_data.img = request.body.image;
			image_meta_data.strokes = new Array();
			sessions[0].session.PPT_Data.push(image_meta_data);
			console.log("Added new image ");

	} catch (err) {
		console.log("Err in setImage" + JSON.stringify(err));
	}

	response.writeHead(200);
	response.write("{'success':0}");
	response.end();
}

exports.startSession = startSession;
function startSession(request, response) {

}

exports.endSession = endSession;
function endSession(request, response) {

	var code;

	try{
			var idx = -1;
			/* We have keep the unique url */
			idx = -1;
			if (sessions[0].session.PPT_Data[sessions[0].session.PPT_Data.length - 1].img == request.body.image)
					idx = sessions[0].session.PPT_Data.length - 1;
			
			if (idx < 0) {
				var end = new Object();
				end.endSession = true;
				sessions[0].session.PPT_Data.push(end);
			} else {
				console.log("Image is already added");
			}	
			code = '{"success", 0}';
	} catch (err) {
		console.log("Err in setImage"+JSON.stringify(err));
		code = "{'error' : -1}";
	}
	/* This image is incorrect, hence ignore it*/
	response.writeHead(200);
	response.write(code);
	response.end();
}

exports.serverData = serverData;
function serverData(request, response) {

	var serverDataLength = sessions[0].session.PPT_Data.length;


	if (serverDataLength < 0) {
		console.log("Error /serverData " + JSON.stringify(serverDataLength));
		/* This image is incorrect, hence ignore it*/
		response.writeHead(200);
		response.write('{"error":-1}');
		response.end();
	}

	var idx = -1;
	if (sessions[0].session.PPT_Data[serverDataLength - 1].img == request.body.imgUrl)
		idx = serverDataLength - 1;

	var points = new Object();

	if (idx < 0) {
		/* This image is incorrect, hence ignore it*/
		response.writeHead(200);
		response.write('{"error":-1}');
		response.end();
		return;
	}

	points.X1 = request.body.pointX1;
	points.Y1 = request.body.pointY1;
	points.X2 = new Array();
	points.Y2 = new Array();

	while (request.body.pointX2.length != 0) {
		points.X2.push(request.body.pointX2.pop());
		points.Y2.push(request.body.pointY2.pop());
	}

	sessions[0].session.PPT_Data[idx].strokes.push(points);

	response.writeHead(200);
	response.write('{"success":0}');
	response.end();
	console.log(JSON.stringify(sessions));
}

/*
 * Client_Data = [

 			{
 				id = <String>,
				current_idx = <number>,
				current_image = <number>
			},...
 		]
 */

var ClientSessionData = new Array();

function getClientId(ClientDataInfo) {

	for ( i = 0; i < ClientSessionData.length; i++) {
		if (ClientSessionData[i].id == ClientDataInfo) {
				console.log("Got the live session");
				return i;
		}
	}
	console.log("User haven't joined the session yet!!");
	return -1;
}

exports.userJoin = userJoin;
function userJoin(request, response) {
	/* TODO: we should keep below in try/catch block */
			var ClientDataInfo = request.body.id;
			console.log("Client Token" + ClientDataInfo);	
			if (getClientId(ClientDataInfo) >= 0) {
					console.log("user is already added!!");
					/* TODO: Change the error code*/
					response.writeHead(404);
					response.end();
					return;			
			}			
			var ClientObj = new Object();
			ClientObj.id = ClientDataInfo;
			ClientObj.current_idx = -1;
		    console.log("Copy Image " + JSON.stringify(sessions[0].session.PPT_Data));
			/* TODO: PPT Data array index needs to be corrected */
			ClientObj.current_image = sessions[0].session.PPT_Data[0].img;
			ClientSessionData.push(ClientObj);
			response.writeHead(200);
			response.write(JSON.stringify("{'success':0}"));
			response.end();
			console.log("User Joined the session :" + JSON.stringify(ClientObj));
}

/* Cliend ID is token ID :P */
var tokenidx = 0;
exports.getClientSessionToken = getClientSessionToken;
function getClientSessionToken(request, response) {
	var token = new Object();

	token.tokenid = tokenidx;
	tokenidx++;

	response.writeHead(200);
	response.write(JSON.stringify(token));
	response.end();

}

var vncToken = "";
exports.vncTokenPost = vncTokenPost;
function vncTokenPost(req, res) {
    vncToken = req.body.vncToken;
    res.writeHead(200);
    res.write("{'success' : 0}");
    res.end();
}

exports.serverDataForClient = serverDataForClient;
function serverDataForClient(request, response) {
	/* TODO: Validations!!*/

	var idx = getClientId(request.body.id);
	var serverDataLength = sessions[0].session.PPT_Data.length - 1;

	if (idx < 0 || serverDataLength < 0) {
		console.log("incorrect client id. Send 404 then :P");
		response.writeHead(404);
		response.end();
		return;
	}

	var imgUrl = sessions[0].session.PPT_Data[serverDataLength].img;
	var strokesLength = sessions[0].session.PPT_Data[serverDataLength].strokes.length - 1;
	var strokes = sessions[0].session.PPT_Data[serverDataLength].strokes;
	var stroke = sessions[0].session.PPT_Data[serverDataLength].strokes[strokesLength];

	var markers = new Object();
	markers.vncToken = vncToken;
	markers.img = imgUrl;
	markers.points = new Array();
	if (ClientSessionData[idx].current_idx <= 0 && strokes.length != 0) {
			for (var i = 0; i < strokes.length; i++) {
				var sendData = new Object();
				sendData.X1 = strokes[i].X1;
				sendData.Y1 = strokes[i].Y1;
				sendData.X2 = new Array();
				sendData.Y2 = new Array();
				for (j = 0; j < strokes[i].X2.length; j++) {
					sendData.X2.push(strokes[i].X2[j]);
					sendData.Y2.push(strokes[i].Y2[j]);
				}
				markers.points.push(sendData);
			}
			response.writeHead(200);
			response.write(JSON.stringify(markers));
			response.end();
		    console.log("Sent All: " + JSON.stringify(sendData));
		    ClientSessionData[idx].current_idx = strokes.length;
		    return;
	}

	if (strokes.length == 0) {
		/* Let's send error message if data is not available*/
		console.log("No data to send. Send 404 then :P");
		response.writeHead(200);
		response.write(JSON.stringify(markers));
		response.end();
		return;		
	}

	if (ClientSessionData[idx].current_idx == sessions[0].session.PPT_Data[serverDataLength].strokes.length) {
		/* Let's send error message if data is not available*/
		console.log("No data to send. Send 404 then :P");
		response.writeHead(200);
		response.write(JSON.stringify(markers));
		response.end();
		return;		
	}

	var sendData = new Object();

    sendData.X1 = stroke.X1;
    sendData.Y1 = stroke.Y1;
    sendData.X2 = new Array();
    sendData.Y2 = new Array();
    for (i = 0; i < stroke.X2.length; i++) {
		sendData.X2.push(stroke.X2[i]);
		sendData.Y2.push(stroke.Y2[i]);
	}

	markers.points.push(sendData);

	response.writeHead(200);
	response.write(JSON.stringify(markers));
	response.end();
    ClientSessionData[idx].current_idx = strokes.length;
    console.log("Sent: " + JSON.stringify(markers));

}