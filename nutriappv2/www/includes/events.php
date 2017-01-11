<?php

function connection(){
  $conn  = include("../config/database.php");
  return $conn;    
}


function events(){
	 $query = "select event_id,
                      event_title,
                      event_description,
                      event_photo
              from event";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {

        echo '<div id="event-'.$row["event_id"].'" class="event col s12 m12">
                <div class="card-panel grey lighten-5 z-depth-2">
                  <div class="row">
                    <div class="col offset-s11">
                        <i class=" fa fa-pencil-square-o fa-2x" style="cursor:pointer;"></i>
                    </div>
                  </div>
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


          echo '<div id="event-modal" class="modal">
                  <div class="modal-content">
                    <h4>Event</h4>
                    <div class="row">
                  <form class="col s12" novalidate id="form">
                    <div class="row">
                      <div class="input-field col s12">
                        <input id="eventname" type="text" name="eventname" class="validate" value="'.$row["event_title"].'" required>
                        <label for="eventname">Event Name</label>
                      </div>
                    </div>
                    <div class="row">
                      <div class="input-field col s12">
                        <input id="eventdescription" type="text" name="eventdescription" class="validate" value="'.$row["event_description"].'" required>
                        <label for="eventdescription">Event Description</label>
                      </div>
                    </div>
                    <div class="file-field input-field">
                      <div class="btn-flat">
                        <span>File</span>
                        <input type="file" id="eventphoto" name="eventphoto" value="'.$row["event_photo"].'">  
                      </div>
                      <div class="file-path-wrapper">
                        <input class="file-path validate" type="text">
                      </div>
                  </div>
                  </form>
                </div>
                  </div>
                  <div class="modal-footer">
                    <button id="submit-event" class="modal-action waves-effect waves-green btn-flat">Submit</button>
                    <button class="modal-action modal-close waves-effect waves-green btn-flat">Cancel</button>
                  </div>
                </div>';

      }
    }
}  