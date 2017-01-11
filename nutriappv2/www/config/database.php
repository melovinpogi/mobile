<?php

$SERVER 	= "www.nutritech.ph";
$USERNAME 	= "nutritec";
$PASSWORD 	= "textcommander2016";
$DATABASE 	= "nutritec_nutriapp"; 

$connection = mysqli_connect($SERVER, $USERNAME, $PASSWORD,$DATABASE);
if(!$connection){
	die("Connection failed: " . mysqli_connect_error());
	return false;
}
else{
	return $connection;
}