$image_path = '';
$nav = 0;

//ADD EVENT
$(document).on("click","#add-event",function(){
	//initialize select
    $('select').material_select();
	$('#add-event-modal').openModal({
		dismissible: false
	});
});



//VIEW EVENT
$(document).on("click",".event",function(){
	eventid 	= $(this).attr("id");
	eventname 	= eventid.substring(0,6);
	eventidf 	= eventid.replace("event-","");

	$("#event-content").html("");
	$("#event-content-modal").openModal({
		dismissible: false,
		ready: function(){
			$.ajax({
		        url: "http://www.nutritech.ph/nutriapp_config/includes/modals.php",
		        type: "POST",
		        data: { 
		                modal: "event",
		                event_id: eventidf
		        },
		        success: function(response) {
		        	$("#event-content").html(response);
		        },
		        error: function(jqXHR, status, error) {
		            // Fail message
		           alert("ajax error");
		        },
		    });
		}
	});
});


//UPLOAD PHOTO
$(document).on("change","#eventphoto",function(){
	file 	= $("#eventphoto").val();

	var extension = file.substr( (file.lastIndexOf('.') +1) );
	var iSize = ($("input[type=file]")[0].files[0].size / 1024); 

	switch(extension){
		case "jpg":
		case "png":
		case "gif":
		case "JPG":
		case "PNG":
		case "GIF":
		case "jpeg":
		case "JPEG":

		     if (iSize / 1024 > 1) { 

		        if (((iSize / 1024) / 1024) > 1) { 
		            iSize = (Math.round(((iSize / 1024) / 1024) * 100) / 100);
		            $("#lblSize").html( iSize + "Gb");
		            alert("File is too large.");
		            $("#eventphoto").val("");
		            $("#lblSize").html("");
		        }

		        else{ 
		            iSize = (Math.round((iSize / 1024) * 100) / 100)
		            $("#lblSize").html( iSize + "Mb"); 
		            if(iSize>1){
		            	alert("File is too large.");
		            	$("#eventphoto").val("");
		            	$("#lblSize").html("");
		            }
		        } 
		     } 

		     else {
		        iSize = (Math.round(iSize * 100) / 100)
		        $("#lblSize").html( iSize  + "kb"); 
		     }    


			tmppath = URL.createObjectURL(event.target.files[0]);

			$image_path = tmppath;

			//alert(tmppath);
		
			imageUrl = tmppath;
		    convertFunction = 'Canvass' ?  
		        convertFileToDataURLviaFileReader : 
		    	convertImgToDataURLviaCanvas;
		    
		    convertFunction(imageUrl, function(base64Img){
		    	$("#imgsrc").val(base64Img);
		    });


		break;
	}
});


//SUBMIT EVENT
$(document).on("click","#submit-add-event",function(){
	eventname 	= $("#eventname").val();
	eventdesc 	= $("#eventdescription").val();
	eventphoto 	= $("#imgsrc").val();
	eventcat	= $("#eventcat").val();

	if(eventname !== "" || eventdesc !== "" || eventphoto !== ""){
		$("#loading").hide().delay(500).fadeIn("slow");
		$.ajax({
	        url: "http://www.nutritech.ph/nutriapp_config/functions/insert.php",
	        type: "POST",
	        data: { 
	                eventname: eventname,
	                eventdesc: eventdesc,
	                eventphoto: eventphoto,
	                eventcat: eventcat,
	                image_path: $image_path,
	                table: "event"
	        },
	        success: function(data) {
	        	if(data == "OK"){
	        		$('#add-event-modal').closeModal();
	        		//REFRESH FRONT PAGE
		             $.ajax({
					      url: "http://www.nutritech.ph/nutriapp_config/templates/front.php",
					      cache: true
					        }).done(function( response ) {
					        $( "#submain-container" ).html( response );
					        $( "#loading" ).show().delay(500).fadeOut("slow");
					    });
	        	}
	        	else{
	        		alert(data);
	        		$('#add-event-modal').closeModal();
	        		$("#loading").show().delay(500).fadeOut("slow");
	        	}
	        },
	        error: function(jqXHR, status, error) {
	            // Fail message
	           alert("ajax error");
	        },
	    });
		
	}
	else{
		alert("Some fields are empty.");	
	}

	$image_path = '';
});



