//EMAIL VALIDATION
function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}


function loginValidation(validation){
	if(validation == "empty"){
		return $("#login-validation").html('<div class="alert alert-danger" role="alert">Please fill all necessary fields! <span class="fa fa-times-circle"></span></div>').show().delay(1000).fadeOut("slow");
	}

	if(validation == "error"){
		$("#login-validation").html('<div class="alert alert-danger" role="alert">Network error has occurred please try again! <span class="fa fa-times-circle"></span></div>').show().delay(1000).fadeOut("slow");
	}

	if(validation == "failed"){
		return $("#login-validation").html('<div class="alert alert-danger" role="alert">Invalid Username / Password <span class="fa fa-times-circle"></span></div>').show().delay(1000).fadeOut("slow");
	}
		
}


function registerValidation(validation){
	if(validation == "char"){
		return $("#registration-validation").html('<div class="alert alert-danger" role="alert">Some fields are empty or Some fields are less than 3. <span class="fa fa-times-circle"></span></div>').show().delay(2000).fadeOut("slow");
	}

	if(validation == "email"){
		return $("#registration-validation").html('<div class="alert alert-danger" role="alert">Invalid email address. <span class="fa fa-times-circle"></span></div>').show().delay(1000).fadeOut("slow");
	}
}


function submitAttr(bool){
	if(bool){
		return $("#submit-register").attr("disabled",true);
	}
	if(!bool){
		 return $("#submit-register").removeAttr("disabled");
	}
}

function successAlert(object,content){
	return $(object).html('<div class="alert alert-success" role="alert">' + content + '<span class="fa fa-times-check"></span></div>').show().delay(2000).fadeOut("slow");
}

function errorAlert(object,content){
	return $(object).html('<div class="alert alert-danger" role="alert">' + content + '<span class="fa fa-times-circle"></span></div>').show().delay(2000).fadeOut("slow");
}



function myIP() {
    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
    xmlhttp.send();

    hostipInfo = xmlhttp.responseText.split("\n");

    for (i=0; hostipInfo.length >= i; i++) {
        ipAddress = hostipInfo[i].split(":");
        if ( ipAddress[0] == "IP" ) return ipAddress[1];
    }

    return false;
}


var ONLINE = function() {
        var networkState = navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        //states[Connection.NONE]     = 'No network connection';

        if (states[networkState]) {
            return true;
        } else {
            return false;
        }
    
}