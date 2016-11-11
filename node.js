document.getElementById("msgSubmit").addEventListener("click", function() {
  var msgField    = document.getElementById("msg");
  var msgTemplate = document.getElementById("msgTemplate");
  var msgDisplay  = document.getElementById("messages");
  
  var d = new Date();
  var n = d.getHours() % 12 + ":" + d.getMinutes() + ":" + d.getSeconds();
  
  var data = {
    username: "Alice",
    message: msgField.value,
    time: n + ":   "
  };

  function instantiateNode(node){
  var clonedNode = node.cloneNode(false);
  if(clonedNode.nodeType == document.ELEMENT_NODE){
    for(var i = 0; i < node.childNodes.length; i++){
      clonedNode.appendChild(instantiateNode(node.childNodes[i]));
    }
  }
  else if (clonedNode.nodeType == document.TEXT_NODE){
    var arrayOfMatches = clonedNode.nodeValue.match(/{{2}[^}]+}{2}/g);
    if(arrayOfMatches != null){
      for(var j = 0; j < arrayOfMatches.length; j++){
        var matchSubstring = arrayOfMatches[j].substring(2, arrayOfMatches[j].length-2);
        clonedNode.nodeValue = clonedNode.nodeValue.replace(arrayOfMatches[j],data[matchSubstring]);
      }
    }
    
  }
    return clonedNode;
    
}
  
  msgDisplay.appendChild(instantiateNode(msgTemplate));
  msgField.value = "";
});



