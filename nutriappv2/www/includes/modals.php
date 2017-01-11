<?php

function connection(){
  $conn  = include("../config/database.php");
  return $conn;    
}

$modal = $_POST["modal"];
if($modal == "event"){

  $event = $_POST["event_id"];
	$query = "select event_id,
                      event_title,
                      event_description,
                      event_photo
              from event 
              where event_id = ".$event." ";
    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {

        //MODAL CONTENT PER EVENT
       echo '<div class="row">
                <h4 class="center-align">'.$row["event_title"].'</h4>
                <div class="col s12 m12 center-align">
                    <img src="'.$row["event_photo"].'" alt="" class="responsive-img">
                </div>
                <p>'.$row["event_description"].'</p>
             </div>';
      }
    }
}
