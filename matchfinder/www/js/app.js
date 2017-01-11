$( document ).ready(function() {


   

    /*Load the homepage*/
    $.get( "ajax/homepage.php", function( data ) {
        $("#homepage").html(data);
    });


    /*Home tab*/
    $("#home").click(function(){
    	$( "#home" ).closest("li").addClass( "active");
    	$( "#profile" ).closest("li").removeClass( "active");
    	$( "#settings" ).closest("li").removeClass( "active");
    	$( "#friends" ).closest("li").removeClass( "active");


    	$( "#profile-content" ).css("display","none");
		$( "#home-content" ).css("display","block");
		$( "#settings-content" ).css("display","none");
		$( "#friend-content" ).css("display","none");

    });

    /*Profile tab*/

     $("#profile").click(function(){
    	$( "#profile" ).closest("li").addClass( "active");
    	$( "#home" ).closest("li").removeClass( "active");
    	$( "#settings" ).closest("li").removeClass( "active");
    	$( "#friends" ).closest("li").removeClass( "active");


		$( "#profile-content" ).css("display","block");
		$( "#home-content" ).css("display","none");
		$( "#settings-content" ).css("display","none");
		$( "#friend-content" ).css("display","none");

            /*Retrieve data from ajax*/
            /*Retreive the information of the current user*/
            $.get( "ajax/profile.php", { userid: userloggedid,userpassword: userloggedpassword,type: 'profile' }, function( data ) {
             $("#profile-caption").html(data);
            });

            /*Retrieve the image of the current user*/
            $.get( "ajax/profile.php", { userid: userloggedid,userpassword: userloggedpassword,type: 'image' }, function( data ) {
             $("#profile-image").html(data);
            });

         });

     /*Settings tab*/

     $("#settings").click(function(){
    	$( "#settings" ).closest("li").addClass( "active");
    	$( "#profile" ).closest("li").removeClass( "active");
    	$( "#home" ).closest("li").removeClass( "active");
    	$( "#friends" ).closest("li").removeClass( "active");

    	$( "#profile-content" ).css("display","none");
		$( "#home-content" ).css("display","none");
		$( "#settings-content" ).css("display","block");
		$( "#friend-content" ).css("display","none");

    });

     /*Friends tab*/

     $("#friends").click(function(){
    	$( "#settings" ).closest("li").removeClass( "active");
    	$( "#profile" ).closest("li").removeClass( "active");
    	$( "#home" ).closest("li").removeClass( "active");
    	$( "#friends" ).closest("li").addClass( "active");

    	$( "#profile-content" ).css("display","none");
		$( "#home-content" ).css("display","none");
		$( "#settings-content" ).css("display","none");
		$( "#friend-content" ).css("display","block");

    });


     $(".customized-btn-block").click(function(){
       $( ".customized-btn-block" ).css("border-color"," #e5a7a9 !important");
     });



      /*Login button*/
     $("#btn-login").click(function(){

    /*Declare the current user logged*/
     var userloggedid = $("#inputUser").val();
     var userloggedpassword = $("#inputPassword").val();

        /*Retrieve the profile of the current user*/
       $.get( "ajax/profile.php", { userid: userloggedid,userpassword: userloggedpassword,type: 'image' }, function( data ) {
           /* alert(data);*/
           if(data.charAt(0) > 0 ){
                $("#login-container").css("display","none");
                $(".loading-icon").css("display","none");
                $("#main-content").css("display","block");
                $("#profile-image").html(data);
           }
           else if(data == -1){
                $("#login-container").css("display","block");
                $(".loading-icon").css("display","none");
                $("#error-text").html("Connection Error.");
                $("#error-box").show("slow").delay(5000).slideup("slow").fadeIn(); 
            }
           else{
                $("#login-container").css("display","block");
                $(".loading-icon").css("display","none");
                $("#error-text").html("Username or Password is incorrect.");
                $("#error-box").show("slow").delay(5000).slideup("slow").fadeIn();          
           }

                /* Like Button */
                $(".like").on("click",function(){
                         var like = $(this).val();
                         var likeid = "#like-" + like;
                         $.get( "ajax/update-like.php", { userpostid: like,type: 'like' }, function( data ) {
                            alert(data);
                            $(likeid).removeClass("btn btn-default");
                            $(likeid).addClass("btn btn-primary");
                         });

                    });


                 /* Unlike Button */
                $(".unlike").on("click",function(){
                         var unlike = $(this).val();
                         var unlikeid = "#unlike-" + unlike;
                         $.get( "ajax/update-like.php", { userpostid: unlike, type:'unlike' }, function( data ) {
                            $(unlikeid).removeClass("btn btn-default");
                            $(unlikeid).addClass("btn btn-danger");
                         });

                    });

            });

     });

    
   
});