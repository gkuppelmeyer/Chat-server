
function repeatedlySendRequest() {   
	var req = new XMLHttpRequest();   
	req.open("GET", "http://localhost:8000/", true);   
	req.send(null); // send request w/no request body (used for POST requests)   
	req.addEventListener("load", function() {
		console.log("resText = " + req.responseText);     
		repeatedlySendRequest(); // repeat request once response has been processed   
	}); 		
};

function sendChatEntranceRequest(username) {
   var req = new XMLHttpRequest();
   req.open("GET", "http://localhost:8000/?user=" + username, true);   
   req.send(null); // send request w/no request body (used for POST requests)   
   req.addEventListener("load", function() { 
   	document.getElementById("messages").innerHTML += (req.responseText); 
   }); 
}

function sendMessage(username, message){
	var req = new XMLHttpRequest();
	req.open("GET", "http://localhost:8000/?user=" + username + "&msg=" + message, true);
	req.send(null);
}

document.getElementById("userButton").addEventListener("click", function() {
	var username = document.getElementById("user").value;
	console.log("username = " + username);
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

  // document.getElementById("msg").value = "";
}); 

document.getElementById("msg").addEventListener("keyup", function(event){
	event.preventDefault();
	if(event.keyCode == 13){
		document.getElementById("msgSubmit").click();
	}
});

// document.getElementById("userButton").addEventListener("click", function(event){
// 	var username = document.getElementById("user").value;
	
// 	window.location.href='#usernameInputDiv';
// 	//repeatedlySendRequest('http://localhost:8000/?user='+username);
// });

document.getElementById("msgSubmit").addEventListener("click", function() {
  var hiddenUser = document.getElementById("hiddenUser").value;
  var msgField    = document.getElementById("msg");
  var msgTemplate = document.getElementById("msgTemplate");
  var msgDisplay  = document.getElementById("messages");

  
  var d = new Date();
  var n = d.getHours() % 12 + ":" + d.getMinutes() + ":" + d.getSeconds();
  
  var data = {
    username: hiddenUser,
    message: msgField.value,
    time: n + ":   "
  };
  // console.log(data.username);
  // console.log(data.message);
  // console.log(data.time);

  function instantiateNode(node){
    //console.log( "d : " + data.message);
  var clonedNode = node.cloneNode(false);
  if(clonedNode.nodeType == document.ELEMENT_NODE){
    for(var i = 0; i < node.childNodes.length; i++){
      clonedNode.appendChild(instantiateNode(node.childNodes[i]));
    }
  }
  else if (clonedNode.nodeType == document.TEXT_NODE){
    console.log("value: " + clonedNode.nodeValue);
    //clonedNode = node.cloneNode(true);
    var arrayOfMatches = clonedNode.nodeValue.match(/{{2}[^}]+}{2}/g);
    console.log("matches: " + arrayOfMatches);
    if(arrayOfMatches != null){
      for(var j = 0; j < arrayOfMatches.length; j++){
        var matchSubstring = arrayOfMatches[j].substring(2, arrayOfMatches[j].length-2);
        console.log(clonedNode==node); 
        clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);
        console.log("e " + data.message);
      }
    }
    
  }

  return clonedNode;
    
}
  console.log(msgTemplate);
  console.log(document.getElementById("msgTemplate"));
  //document.getElementById("msgTemplate").childNodes[0].nodeValue = "CHANGED";
  msgTemplate.id = "nothing";
  msgDisplay.appendChild(instantiateNode(msgTemplate));
  msgTemplate.id = "msgTemplate";
  msgField.value = "";
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// document.getElementById("msgSubmitButton").addEventListener("click", function() {   
// 	var msg = document.getElementById("messageField").value;
// 	var username = document.getElementById("hiddenField").value; // other options?   
// 	sendMessage(username, message); // implement like sendChatEntranceRequest // refactoring?
// });

// function repeatedlySendRequest() {
//   var req = new XMLHttpRequest();
//   req.open("GET", "http://localhost:9000/", true);
//   req.send(null); // send request w/no request body (used for POST requests)
//   req.addEventListener("load", function() { 
//     var data = JSON.parse(req.responseText);
//     chatServer.emit(data.eventStr, data);
//     repeatedlySendRequest(); // repeat request once response has been processed
//   });
// }

// function instantiateTemplate(id, data) {
//   var nodeToAppendData = document.getElementById(id); // msgDisplay in http://codepen.io/anon/pen/ALaEbg 
//   // your code to instantiate template goes here
  
// }

// function EventEmitter() {
//   this.eventListeners = {}; // eventName: handler
// }

// EventEmitter.prototype.on = function(eventStr, handler) {
//   // add eventStr property to eventListeners object with 
//   // value of [handler] if it doesn’t exist (i.e., if no
//   // eventListeners for event); push it to the array 
//   // otherwise
//   // modify this.eventListeners[eventStr];
// }

// EventEmitter.prototype.emit = function(eventStr) {
//   // iterate over array of event handlers 
//   // this.eventListeners[eventStr] calling each one, 
//   // passing arguments: See:
//   // http://codepen.io/anon/pen/KgYxrW?editors=0011 
// }

// var chatServer = new EventEmitter();
// chatServer.on("message", function(data) {
//   instantiateTemplate("msgTemplate", {username: data.username, msg: data.msg});
// });

// document.getElementById("msgSubmitButton").addEventListener("click", function() {
//   var msgField    = document.getElementById("msg");
//   var msgTemplate = document.getElementById("msgTemplate");
//   var msgDisplay  = document.getElementById("messages");
  
//   var d = new Date();
//   var n = d.getHours() % 12 + ":" + d.getMinutes() + ":" + d.getSeconds();
  
//   var data = {
//     username: "Alice",
//     message: msgField.value,
//     time: n + ":   "
//   }; 

//   function instantiateNode(node){
//   var clonedNode = node.cloneNode(false);
//   if(clonedNode.nodeType == document.ELEMENT_NODE){
//     for(var i = 0; i < node.childNodes.length; i++){
//       clonedNode.appendChild(instantiateNode(node.childNodes[i]));
//     }
//   }
//   else if (clonedNode.nodeType == document.TEXT_NODE){
//     var arrayOfMatches = clonedNode.nodeValue.match(/{{2}[^}]+}{2}/g);
//     if(arrayOfMatches != null){
//       for(var j = 0; j < arrayOfMatches.length; j++){
//         var matchSubstring = arrayOfMatches[j].substring(2, arrayOfMatches[j].length-2);
//         clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);
//       }
//     }
    
//   }
//     return clonedNode;
    
// }
  
//   msgDisplay.appendChild(instantiateNode(msgTemplate));
//   msgField.value = "";
// });