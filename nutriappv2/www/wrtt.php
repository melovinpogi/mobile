<?php
 include("db.php");


 if( connection() === false ) {
     die( print_r( sqlsrv_errors(), true));
	}

	$query = sqlsrv_query(connection(), 'SELECT * FROM app_promo');
	while($obj = sqlsrv_fetch_object($query))
        echo $obj->promo_title.'<br />';
/*
    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {     
          echo "<img id='".$row["rtt_code"]."' src='".$row["rtt_image"]."' alt='".$row["rtt_level"]."' class='img-thumbnail responsive-img' 
            data-toggle='modal' data-target='#wrtt-modal' longdesc='<br><b>".$row["rtt_name"]." <br> ".$row["rtt_team"]."'>";
        }
      }*/
 ?>