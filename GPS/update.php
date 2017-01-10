<?php
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	$connection = mysqli_connect("localhost", "root", "","bus");
	if(!$connection){
		die("Connection failed: " . mysqli_connect_error());
		return false;
	}
	else{
	$json = $_POST['update'];
	$result = json_decode($json, true);
  	print_r($result);        // Dump all data of the Array
  	//echo $someArray[0]["name"]; // Access Array data


	}



