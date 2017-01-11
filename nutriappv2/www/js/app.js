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


$(document).ready(function(){

$.getJSON('http://ipinfo.io', function(data){
  // console.log(data.ip)

  if(data.ip == '122.2.48.48')
  {

    $ipaddress = 'http://192.168.1.157:8080/nutritech/app/';

  }
  else
  {

    $ipaddress = 'http://122.2.48.48:8080/nutritech/app/';

  }


    console.log($ipaddress + 'wrtt.php');

    $("a").removeClass("ui-icon-carat-r ui-btn-icon-right");
    $("#reset").hide();
    $("#user-logged-leftpanel").hide();
    $("#user-logged-content").hide();

    ///////////////////////////////////////////
    $.ajax({
            type: 'get',  
            url: $ipaddress + 'wrtt.php',
            dataType: 'jsonp',
            async: 'true',
            beforeSend: function() {
                 $.mobile.loading('show', {theme:"b", text:"Please wait... Loading Resources..", textonly:true, textVisible: true}); 
            },
            complete: function() {
                $.mobile.loading('hide');
            },
            success: function(content) {
               $("#wrtt-div").html(content);
               if($session_user != "x"){
                    $.mobile.loading('show', {theme:"b", text:"Verify User...", textonly:true, textVisible: true});
                    $("#login").hide();
                    $("#viewing-content").hide();
                    $("#user-logged-leftpanel").show();
                    $("#user-logged-content").show();
                    $("#profile").html($session_user.toUpperCase());
                    window.location.hash = "#main-page";
                    console.log($session_user);
                    console.log($ipaddress + 'wrtt.php')
                }
            },
            error: function(request, status, error) {
                //$.mobile.loading('show', {theme:"b", text:"Network Error", textonly:true, textVisible: true}); 
                alert("No Network Connection. Please Try again.");
                //$(location).attr('href','index.html');
            }
        });

     ///////////////////////////////////////////

   /* $.ajax({
            url: 'http://www.nutritech.ph/nutriapp_config/events.php',
            type: 'GET',
            dataType: 'html',
            async: true,
            beforeSend: function() {
                //$.mobile.loading('show', {theme:"b", text:"Please wait...", textonly:true, textVisible: true}); 
            },
            complete: function() {
               // $.mobile.loading('hide');
            },
            success: function(content) {
               $("#main-container").append(content);
            },
            error: function(request, status, error) {
               // $.mobile.loading('show', {theme:"b", text:"Network Error", textonly:true, textVisible: true}); 
               alert("No Network Connection. Please Try again.");
               $(location).attr('href','index.html');
            }
        });*/
    });

});

