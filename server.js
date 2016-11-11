var http = require("http");
var chatList = [];
var routes = [];
addRoute("GET", /^\/$/, addResponse);
addRoute("GET", /^\/\?user=\w+$/, userWelcome);
addRoute("GET", /^\/\?user=\w+&msg=\w+$/, userMessage);
var server = http.createServer(function(request, response) { 
	response.writeHead(200, {"Content-Type": "text/html", "Access-control-allow-origin": "*"}); 
	request.name = request.connection.remoteAddress + ":" + request.connection.remotePort;
	resolve(request, response);
	request.on('close', function(){
		console.log("closed");
		chatList.splice(chatList.indexOf(response),1);
		broadcast(" left the chat room. \n", "Server" + response.name);
	});

}); 

server.listen(8000);

function broadcast(message, client){
	chatList.forEach(function(participant){
		participant.write("<p>" + client + " : " + message + "</p>");
		chatList = [];
	});

}

function addRoute(method, url, handler){
	routes.push({
		method : method,
		url : url,
		handler : handler
	});
}


function addResponse(request, response, data){
	chatList.push(response);
	
}

function userWelcome(request, response, data){
	response.write("<h1>Welcome to the Chat <code>" + data.username + " \n </code>!!</h1>"); 
	response.name = data.username;
	chatList.push(response);
	broadcast(data.username + " entered the chat room. \n", "Server");
	console.log(response.name + " connected to the server.");
	response.end();
}

function userMessage(request, response, data){
	response.name = data.username;
	chatList.push(response);
	broadcast(data.message, data.username);
	console.log(response.name);
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
			var urlAfterQuestionMark = stringUrl.split("/?"); //var[0] is empty, var[1] is everything after
			if(urlAfterQuestionMark[1]){
				var getMessage = urlAfterQuestionMark[1].split("=");
				var getUsername = getMessage[1].split("&"); //splits the name from &msg.
				data.message = getMessage[2];
				data.username = getUsername[0];
			
			}

			routes[i].handler(request, response, data);
			
		}
	}
}
