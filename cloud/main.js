// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
/*var name = require('cloud/name.js');
require('cloud/app.js')
AV.Cloud.define("hello", function(request, response) {
    console.log(request.user);
	response.success("Hello world," + request.params.name);
});
/*
AV.Cloud.beforeSave("TestReview", function(request, response){
	if (request.object.get("stars") < 1) {
		response.error("you cannot give less than one star");
	} else if (request.object.get("stars") > 5) {
		response.error("you cannot give more than five stars");
	} else {
		var comment = request.object.get("comment");
		if (comment && comment.length > 140) {
			// Truncate and add a ...
			request.object.set("comment", comment.substring(0, 137) + "...");
		}
		response.success();
	}
});

AV.Cloud.afterSave("TestReview", function(request) {
	var query = new AV.Query("TestPost");
	query.get(request.object.get("post").id, {
		success: function(post) {
			post.increment("comments");
			post.save();
		},
		error: function(error) {
			throw "Got an error " + error.code + " : " + error.message;
		}
	});
});
*/

/**
 * Created by kawagiri on 15/7/18.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response){
    response.writeHead(404,{'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents){
    response.writeHead(
        200,
        {"content-type":mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    } else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response,absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        })
    }
}

var server = http.createServer(function(request, response){
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(3000, function(){
    console.log("Server listening on port 3000.");
})

var chatServer = require('views/chat_server');
chatServer.listen(server);
