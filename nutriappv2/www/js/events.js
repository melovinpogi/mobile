//WRTT IMAGES
$(document).on("click","img",function(){
    imgid = $(this).attr("id");
    img = $("#" + imgid).attr("src");
    title = $("#" + imgid).attr("alt");
    desc = $("#" + imgid).attr("longdesc");

    $("#wrtt-img").attr("src",img);
    $("#wrttLabel").html(title);
    $("#wrttDesc").html(desc);

});




//LOGIN 
$(document).on("pageinit", "#login", function(){ 
    $(document).on("click", "#submitx", function() { // catch the form's submit event
        if( $('#username').val().length > 0 && $('#password').val().length > 0){
            // Send data to server through the Ajax call
            // action is functionality we want to call and outputJSON is our data
                $.ajax({url: 'http://www.nutritech.ph/nutriapp_config/check.php',
                    data: {action : 'login', formData : $('#check-user').serialize()},
                    type: 'post',                  
                    async: 'true',
                    dataType: 'json',
                    beforeSend: function() {
                        $.mobile.loading('show', {
                                            theme:"b", 
                                            text:"Identifying " + $('#username').val() + "...", 
                                            textonly:true, 
                                            textVisible: true
                                        });
                    },
                    complete: function() {
                        //$.mobile.loading('hide');
                    },
                    success: function (result) {
                        if(result.status) {
                        	insertRecord();
                        	$("#login").hide();
                        	$("#viewing-content").hide();
                        	$("#user-logged-leftpanel").show();
                        	$("#user-logged-content").show();
                           	$("#profile").html(result.firstname.toUpperCase());
                           	window.location.hash = "#main-page";
                           	
                           	//$.mobile.changePage( "index.html", { transition: "fade", changeHash: false });
                        } else {
                             $.mobile.loading('hide');
                             loginValidation("failed");
                        }
                        $.mobile.loading('hide');
                    },
                    error: function (request,error) {
                         alert("No Network Connection. Please Try again.");
                			$(location).attr('href','index.html');
                    	}
                });                  
        } else {
            loginValidation("empty");
        }          
        return false; 
    });   
});



//LOGOUT
$(document).on("click", "#logout", function() {
	deleteRecord();
	$(location).attr('href','index.html');
});


//PHONE NUMBER VALIDATION
$(document).on("keypress","#phone",function(e){
   if($phone.val().length == 11 ){
        e.preventDefault();
   }
});


//LETTER VALIDATION
$(document).on("keydown","#firstname,#middlename,#lastname",function(e) {
  if (e.shiftKey || e.ctrlKey || e.altKey) {
    e.preventDefault();
  } else {
    var key = e.keyCode;
    if (!((key == 8) || (key == 32) || (key == 46) || (key >= 35 && key <= 40) || (key >= 65 && key <= 90))) {
      e.preventDefault();
    }
  }
});




//SUBMIT FORM
$(document).on("click","#submit-registerx",function(){
   if( 	$firstname.val().length < 3 ||  
   		$middlename.val().length < 3 || 
   		$lastname.val().length < 3 ||
   		$rusername.val().length < 3 ||
   		$rpassword.val().length < 3 ||
   		$email.val().length < 3 ||
   		$phone.val().length < 11 ||
   		$code.val().length == 0 ){

  		 $.mobile.loading('show', {
                theme:"b", 
                text:"Some fields are empty or Some fields are less than 3.", 
                textonly:true, 
                textVisible: true
            });

  		  setInterval(	function(){ 
  		  	$.mobile.loading('hide'); 
  		  }, 3000);

  		return;
  }

  	if(!isEmail($email.val()) ){
	  	 $.mobile.loading('show', {
                theme:"b", 
                text:"Invalid email address.", 
                textonly:true, 
                textVisible: true
            });

  		  setInterval(	function(){ 
  		  	$.mobile.loading('hide'); 
  		  }, 3000);
	  	return;
  	}

  	// VERIFY NTACH CODE
  	if( $code.val().length > 0 ){
  		 $.ajax({
            url: 'http://www.nutritech.ph/nutriapp_config/check_code.php',
            data: {distributor_code : $code.val() },
            type: 'post',                  
            async: 'true',
            dataType: 'json',
            beforeSend: function() {
                 $.mobile.loading('show', {
                 	theme:"b", 
                 	text:"Verifying...",
                 	textonly:true, 
                 	textVisible: true}); 
            },
            complete: function() {
                //$.mobile.loading('hide');
            },
            success: function(result) {
               if(result.status){
               		$.mobile.loading('show', {
               			theme:"b", 
               			text:"Code Verified. You are " + result.distributor + " ", 
               			textonly:true, 
               			textVisible: true
               		}); 

               		console.log(result.distributor);
               			////////////////////////////////////////////////////////////////////////////////

						    $.ajax({	
						    	url: 'http://www.nutritech.ph/nutriapp_config/registration.php',
						        data: {
						        		//action : 'registration', 
						        		formData : $('#register-user').serialize()
						        	},
						        type: 'post',                  
						        async: 'true',
						        dataType: 'json',
						        beforeSend: function() {
						            $.mobile.loading('show', {
						                                theme:"b", 
						                                text:"Please wait...", 
						                                textonly:true, 
						                                textVisible: true
						                            });
						        },
						        complete: function() {
						            //$.mobile.loading('hide');
						        },
						        success: function (result) {
						        	if(result.status){
						        		//successAlert("#registration-validation","Registration Success!");
						        		 $.mobile.loading('show', {
						                                theme:"b", 
						                                text:"Registration Success!", 
						                                textonly:true, 
						                                textVisible: true
						                            });
						        		$("#reset").trigger('click');
						        	}
						        	else{
						        		//errorAlert("#registration-validation","Registration Failed!");
						        		$.mobile.loading('show', {
						                                theme:"b", 
						                                text:"Registration Failed!", 
						                                textonly:true, 
						                                textVisible: true
						                            });
						        		$("#reset").trigger('click');
						        	}
						        	$.mobile.loading('hide');
						           
						        },
						        error: function (request,error) {
						        	 alert("No Network Connection. Please Try again.");
						                $(location).attr('href','index.html');
						        }
							});  

               }
               else{
               		$.mobile.loading('show', {
               			theme:"b", 
               			text:" " + result.distributor + " ", 
               			textonly:true, 
               			textVisible: true
               		}); 

               		console.log(result.distributor);
               }

                setInterval(	function(){ 
		  			$.mobile.loading('hide'); 
		  		 }, 3000);
            },
            error: function(request, status, error) {
                //$.mobile.loading('show', {theme:"b", text:"Network Error", textonly:true, textVisible: true}); 
                alert("No Network Connection. Please Try again.");
                $(location).attr('href','index.html');
            }
        });
  	}

  	         
});

