<?php
 include("connection.php");

 $code = $_POST["distributor_code"];
 $query = "select distributor_name from distributor where distributor_code = '".$code."' ";
 $status = true;
 $distributor = "";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {     
          $distributor = $row["distributor_name"];
        }
      }
      else{
          $distributor = "Code is not registered.";
          $status = false;
      }

      $output = array('status' => $status, 'distributor' => $distributor);
      echo json_encode($output);
 ?>