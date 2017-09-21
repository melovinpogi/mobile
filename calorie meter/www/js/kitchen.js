//Network Connection 
var network = true;
function networkconnection() {
	if(navigator.onLine)
  {
    //alert('You are Online');
    return true;
  }
  else
  {
    alert('No internet Connection');
    network = false;
    return false;
  }
}

networkconnection();


$(document).ready(function(){
	if(network){
	window.top.close();
	}
});

