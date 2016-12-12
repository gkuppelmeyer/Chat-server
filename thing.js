
// document.getElementById("msgSubmit").addEventListener("click", function() {
//   // var hiddenUser = document.getElementById("hiddenUser").value;
//   // var msgField    = document.getElementById("msg");
//   var msgTemplate = document.getElementById("msgTemplate");
//   var msgDisplay  = document.getElementById("messages");

  
//   var d = new Date();
//   var h = d.getHours();
//   var m = d.getMinutes();
//   var s = d.getSeconds();
//   var APM = "AM";
//   if(h >= 13 && h != 0){
//     h %= 12;
//     APM = "PM";
//   }
//   if(h < 10){
//     h = "0" + h;
//   }
//   if(m < 10){
//     m = "0" + m;
//   }
//   if(s < 10){
//     s = "0" + s;
//   }
//   var n = h + ":" + m + ":" + s + " " + APM;

  
//   var data = {
//     username: data.username,
//     message: data.message,
//     time: n
//   };

//   function instantiateNode(node, data){
//     //console.log( "d : " + data.message);
//   var clonedNode = node.cloneNode(false);
//   if(clonedNode.nodeType == document.ELEMENT_NODE){
//     for(var i = 0; i < node.childNodes.length; i++){
//       clonedNode.appendChild(instantiateNode(node.childNodes[i]), data);
//     }
//   }
//   if (clonedNode.nodeType == document.TEXT_NODE){
//     //clonedNode = node.cloneNode(true);
//     var arrayOfMatches = clonedNode.nodeValue.match(/{{2}[^}]+\}{2}/g);//{{2}[^}]+\}{2}
//     if(arrayOfMatches != null){
//       for(var j = 0; j < arrayOfMatches.length; j++){
//         var matchSubstring = arrayOfMatches[j].substring(2,arrayOfMatches[j].length-2);
//         clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);
//       }
//     }
//   }
//   return clonedNode;
// }
//   // console.log(data.username);
//   // console.log(data.message);
//   // console.log(data.time);
//   //msgTemplate.id = "nothing";
//   msgDisplay.appendChild(instantiateNode(msgTemplate));
//   //msgTemplate.id = "msgTemplate";
//   msgField.value = "";
//   window.scrollTo(0,document.body.scrollHeight);
// });



function EventEmitter() {
  this.eventListeners = {}; // eventName: handler
}

EventEmitter.prototype.on = function(eventStr, handler) {
  if(!(this.eventListeners[eventStr])){
    this.eventListeners[eventStr] = [handler];
  } else {
    this.eventListeners[eventStr].push(handler);
  }
}

EventEmitter.prototype.emit = function(eventStr) {
	var args = this.eventListeners[eventStr];
	for(i = 0; i < args.length; i++){
		var func = this.eventListeners[eventStr][i];
		func(arguments[i+1]);
	}
}

var chatServer = new EventEmitter();

chatServer.on("message", function(data) {
	// console.log("message event");
	// console.log("data from .on:"+JSON.stringify(data));
  var msgTemplate = document.getElementById("msgTemplate");
  // var msgField = document.getElementById("msg");
  var msgDisplay  = document.getElementById("messages");

  // var d = new Date();
  // var h = d.getHours();
  // var m = d.getMinutes();
  // var s = d.getSeconds();
  // var APM = "AM";
  // if(h >= 13 && h != 0){
  //   h %= 12;
  //   APM = "PM";
  // }
  // if(h < 10){
  //   h = "0" + h;
  // }
  // if(m < 10){
  //   m = "0" + m;
  // }
  // if(s < 10){
  //   s = "0" + s;
  // }
  // var n = h + ":" + m + ":" + s + " " + APM;

  
  // data.time = n;
  // console.log("data from .on after time:"+JSON.stringify(data));
  var clonedTemplate = instantiateTemplate("msgTemplate", data);
  console.log(clonedTemplate);
  // clonedTemplate.style.display = "inline";
  msgDisplay.appendChild(clonedTemplate);
  // msgField.value = "";
  window.scrollTo(0,document.body.scrollHeight);
});

chatServer.on("join", function(data){
	document.getElementById("messages").innerHTML += "<p><strong>Chat: <i>" + data.username[1] + "</strong> has joined the chat!" + "</i></p>";
});

chatServer.on("leave",function(data){
  document.getElementById("messages").innerHTML += "<p><strong>Server: <i>" + data.username[1] + "</strong> has left the chat." + "</i></p>";  
});



function instantiateTemplate(id, data) {
  var nodeToAppendData = document.getElementById(id); // msgDisplay in http://codepen.io/anon/pen/ALaEbg 
  // your code to instantiate template goes here
  // console.log("nodeToAppendData: " + nodeToAppendData);
  var instantiated = instantiateNode(nodeToAppendData, data);
  return instantiated;
  
}

function repeatedlySendRequest() {   
  var req = new XMLHttpRequest();   
  req.open("GET", "http://localhost:8000/", true);   
  req.send(null); // send request w/no request body (used for POST requests)   
  req.addEventListener("load", function() {
    // console.log("resText = " + req.responseText);
    var parsedData = JSON.parse(req.responseText);
    // console.log("parsedData = " + JSON.stringify(parsedData));
    chatServer.emit(parsedData.event, parsedData);
    // if(parsedData.event == "join") {
    //   document.getElementById("messages").innerHTML += "<p> " + parsedData.username[1] + " joined the chat.</p>";
    // } else if (parsedData.event == "leave"){
    //   document.getElementById("messages").innerHTML += "<p> " + parsedData.username[1] + " left the chat.</p>"; 
    // } else if (parsedData.event == "message"){
    //   document.getElementById("messages").innerHTML += "<p>" + parsedData.username[1] + ": " + parsedData.message + "</p>";
    // }
    repeatedlySendRequest(); // repeat request once response has been processed   
  });     
};

function sendChatEntranceRequest(username) {
   var req = new XMLHttpRequest();
   req.open("GET", "http://localhost:8000/?user=" + username, true);   
   req.send(null); // send request w/no request body (used for POST requests)   
   req.addEventListener("load", function() { 
    repeatedlySendRequest(); 
    var parsedData = JSON.parse(req.responseText);
    // console.log(parsedData.username);
    document.getElementById("messages").innerHTML += "<h1> Welcome to the chat <code>" + parsedData.username[1] + "</code>!!!</h1>"
    
   }); 
}

function sendMessage(username, message){
  var req = new XMLHttpRequest();
  req.open("GET", "http://localhost:8000/?user=" + username + "&msg=" + message, true);
  req.send(null);
}

function instantiateNode(node, data){
    //console.log( "d : " + data.message);
    // console.log("node: " + node);
    // console.log("data: "+JSON.stringify(data));
  var clonedNode = node.cloneNode(false);
  if(clonedNode.nodeType == document.ELEMENT_NODE){

    for(var i = 0; i < node.childNodes.length; i++){
      clonedNode.appendChild(instantiateNode(node.childNodes[i], data));
    }
  }
  if (clonedNode.nodeType == document.TEXT_NODE){
    //clonedNode = node.cloneNode(true);
    var arrayOfMatches = clonedNode.nodeValue.match(/{{2}[^}]+\}{2}/g);//{{2}[^}]+\}{2}
    // console.log("matches: " + arrayOfMatches);
    // console.log("data:"+JSON.stringify(data));
    if(arrayOfMatches != null){
      for(var j = 0; j < arrayOfMatches.length; j++){
        var matchSubstring = arrayOfMatches[j].substring(2,arrayOfMatches[j].length-2);
        // console.log("node: "+matchSubstring);
        if(matchSubstring == "username") {
        	clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring][1]);

        } else {
        	clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);

        }
        // clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);
      }
    }
  }
  return clonedNode;
}

document.getElementById("userButton").addEventListener("click", function() {
  var username = document.getElementById("user").value;
  var hiddenUser = document.getElementById("hiddenUser").value = username;
  window.location.href='#usernameInputDiv';
  sendChatEntranceRequest(username);
});

document.getElementById("user").addEventListener("keyup", function(event){
  event.preventDefault();
  if(event.keyCode == 13){
    document.getElementById("userButton").click();
  }
});


document.getElementById("msgSubmit").addEventListener("click", function() {
  var msg = document.getElementById("msg").value;
  var username = document.getElementById("hiddenUser").value;
  
  sendMessage(username, msg);

  

  document.getElementById("msg").value = "";
}); 

document.getElementById("msg").addEventListener("keyup", function(event){
  event.preventDefault();
  if(event.keyCode == 13){
    document.getElementById("msgSubmit").click();
  }
});
