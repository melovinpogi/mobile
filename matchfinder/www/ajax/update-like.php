<?php
include('../connect/db.php');

$userpostid = $_GET["userpostid"];
$type = $_GET['type'];

echo $global_userid;

if($type =='like'){
	//Check if the users is already like the post of the other users post.
	//Then if he/she like the post but he/she already unlike the post. This will be automatically remove the unlike to the post.
	$sql2 = mysql_query("select * from users_activity where user_id='".$global_userid."' and users_post_id= '".$userpostid."' and unlike=1 ");
	$rows = mysql_num_rows($sql2);


	if($rows == 1){
		$sql = mysql_query("update users_post set likes = likes + 1 where id= '".$userpostid."' ");
		$result = mysql_query("update users_post set unlikes = unlikes - 1 where id= '".$userpostid."' ");
	}
	else{
		$insert = mysql_query("insert into users_activity(user_id,users_post_id,like,unlike) 
								select '".$global_userid."','".$userpostid."',1,0");
	}
}
elseif ($type=='unlike') {
	$sql = mysql_query("update users_post set unlikes = unlikes + 1 where id= '".$userpostid."' ");
}


if($sql === FALSE) {
    die("Error, Cannot connect to the database."); // TODO: better error handling
}

