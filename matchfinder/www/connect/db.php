<?php
$mysql_hostname = "localhost";
$mysql_user = "easterni_matchf";
$mysql_password = "Melovin123";
$mysql_database = "easterni_matchf";
$prefix = "";
$bd = mysql_connect($mysql_hostname, $mysql_user, $mysql_password) or die("Could not connect database");
mysql_select_db($mysql_database, $bd) or die("Could not select database");
?>