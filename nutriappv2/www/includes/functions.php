<?php

function connection(){
  $conn  = include("../config/database.php");
  return $conn;    
}


function events($event){
	 $query = "select event_id,
                      event_title,
                      event_description,
                      event_photo
              from event where event_type = ".$event." ";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {

        //LIST OF EVENTS

        echo '<div id="event-'.$row["event_id"].'" class="event col s12 m12">
                <div class="card-panel grey lighten-5 z-depth-2">
                    <h5 class="bold flow-text center-align">'.$row["event_title"].'</h5>
                    <div class="row valign-wrapper">
                      <div class="col s12 m12 center-align">
                        <img src="'.$row["event_photo"].'" alt="" class="responsive-img">
                      </div>
                      <div class="col s12 m12 hide-on-small-only">
                        <h6 class="black-text hide-on-small-only">
                          '.$row["event_description"].'
                        </h6>
                      </div>
                  </div>
                   <h6 class="black-text hide-on-med-and-up truncate">
                        '.$row["event_description"].'
                      </h6>
                  </div>
               </div>';

      }

    }
}  
