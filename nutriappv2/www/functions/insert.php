<?php
function connection(){
  $conn  = include("../config/database.php");
  return $conn;    
}

$table = $_POST["table"];

if($table == "event"){
	$eventtitle 	= $_POST["eventname"];
	$eventdesc 		= $_POST["eventdesc"];
	$eventphoto 	= $_POST["eventphoto"];	
	$eventcat 		= $_POST["eventcat"];
	$image 			= $_POST["image_path"];

	$query = "insert into event(event_title,event_description,event_photo,event_type)
				select '".$eventtitle."','".$eventdesc."','".$eventphoto."',".$eventcat." ";
	if(mysqli_query(connection(),$query)){
		echo "OK";
	}
	else{
		echo("Error description: " . mysqli_error(connection(),$query));
	}
}