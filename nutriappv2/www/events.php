<?php
 include("connection.php");

 $query = "select * from event order by event_id ";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {     
          echo '<div data-role="page" id="event-page-'.$row["event_id"].'" data-theme="a" data-url="event-page-'.$row["event_id"].'" class="ui-corner-all ui-content" >
                  <div class="container img-header">
                    <div class="row">
                      <div data-role="header" role="banner" class="div-header" data-theme="b">
                        <a href="#main-page" data-transition="slidefade" class="page-home">
                          <i class="fa fa-home"></i>
                        </a>
                        <img class="img-responsive logo-header" src="img/logofinal.png">
                      </div>
                    </div>
                  </div>
                  <div data-role="header" data-theme="b" class="page-home page-top">
                    <h1 class="font-bold">'.$row["event_title"].'</h1>
                  </div><br>
                  <div class="container container-top">
                    <div class="row">
                      <div class="col-sm-12 col-md-12">
                        <a href="#" class="thumbnail">
                          <img class="img-responsive media-object" src="'.$row["event_photo"].'" alt="...">
                        </a>
                      </div>
                      <div class="col-sm-12 col-md-12">
                        <p>'.$row["event_description"].'</p>
                      </div>
                    </div><br>
                  </div>
                </div>';
        }
      }
 ?>