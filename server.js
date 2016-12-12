console.log("Server On!");
var http = require("http");
var chatList = [];
var routes = [];
addRoute("GET", /\/$/, addResponse);
addRoute("GET", /\/\?user=\w+$/, userWelcome);
addRoute("GET", /\/\?user=(\w+)&msg=(\w+)$/, userMessage);
var server = http.createServer(function(request, response) { 
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"}); 
	request.name = request.connection.remoteAddress + ":" + request.connection.remotePort;
	resolve(request, response);
	request.on('close', function(){
		chatList.splice(chatList.indexOf(response),1);
		var dataString = JSON.stringify({
			event: "leave",
			username: response.name
		});
		broadcast(dataString);
		response.end();
	});

}); 

server.listen(8000);

function broadcast(dataStr){
	chatList.forEach(function(participant){
		//console.log(dataStr);
		participant.write(dataStr);
		participant.end();
	});
	chatList = [];
}

function addRoute(method, url, handler){
	routes.push({
		method : method,
		url : url,
		handler : handler
	});
}


function addResponse(request, response, data){
	//console.log("1");
	data.event = "stalk";
	chatList.push(response);
}

function userWelcome(request, response, data){
	//console.log("2");
	data.event = "join";
	var dataString = JSON.stringify(data);
	response.name = data.username;
	data.message = data.message;
	// chatList.push(response);
	response.write(dataString);
	broadcast(dataString);
	response.end();
}

function userMessage(request, response, data){
	//console.log("3");
	data.event = "message";
	//console.log(data);
	var dataString = JSON.stringify(data);
	response.name = data.username;
	broadcast(dataString);
	response.end();
}

function resolve(request, response){
	var reqMethod = request.method;
	var reqUrl = request.url;
	//console.log("ReqURL: " + reqUrl);
	for(var i = 0; i < routes.length; i++){
		if(routes[i].method == reqMethod && routes[i].url.test(reqUrl)){
			
			var data = {
				username: '',
				message: ''
			}

			var stringUrl = reqUrl;
			//console.log(stringUrl);
			var regexUser = /\/\?user=(\w+)/;
			var regexMessage = /&msg=(\w+)$/;
			var execUser = regexUser.exec(stringUrl);
			var execMessage = regexMessage.exec(stringUrl);
			//console.log(execUser);
			data.username = execUser;
			if (execMessage != null){
				data.message = execMessage[1];
			} else {
				data.message = null;
			}

			routes[i].handler(request, response, data);
			
		}
	}
}


