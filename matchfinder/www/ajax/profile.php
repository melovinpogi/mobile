<?php
include('../connect/db.php');

$get_userid = $_GET['userid'];
$get_userpassword = $_GET['userpassword'];
$get_type = $_GET['type'];


$sql = mysql_query("select firstname,lastname, address,age,gender,description,photo,id from users where username = '".$get_userid."' and password= '".$get_userpassword."' ");




$rows = mysql_num_rows($sql);

if($sql === FALSE) {
    die('-1'); // TODO: better error handling
}
   
       while($query = mysql_fetch_array($sql)){
        
       	$firstname 	= $query[0];
       	$lastname 	= $query[1];
       	$address 	  = $query[2];
       	$age		    = $query[3];
       	$gender 	  = $query[4];
       	$description= $query[5];
       	$photo 		  = $query[6];

     }

     if($get_type=='profile' && $rows !=0){
       echo "1";
       	echo '<h4 class="text-adjustment"><small>'.$firstname. ' ' .$lastname.' </small></h4>
  		<h4 class="text-adjustment"><small>'.$age.', ' .$gender. '</small></h4>
  		<h4 class="text-adjustment"><small>'.$address.'</small></h4>
  		<p>'.$description.'</p>';

    }
    elseif ($get_type=='image' && $rows !=0 ) {
      echo "1";
      echo '<img src="data:image/jpeg;base64,' . base64_encode( $photo ) . '" alt="" class="img-thumbnail img-responsive">';
    }
    else{
      echo $rows;
    }

?>