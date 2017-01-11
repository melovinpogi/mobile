<?php
    include("connection.php");

    // We don't need action for this tutorial, but in a complex code you need a way to determine Ajax action nature
    $action = $_POST['action'];
     
    // Decode parameters into readable PHP object
    parse_str($_POST['formData'], $output);
  
    // Get username and password
    $username = $output['username'];
    $password = $output['password'];
    $status = false;

    $query = "select user_id,username,firstname from user where username = '".$username."' and password = '".$password."' ";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $status = true;
        $firstname = $row["firstname"];
      }
    }
  
    // Let's say everything is in order
    $output = array('status' => $status, 'username' => $username, 'firstname' => $firstname);
    echo json_encode($output);
?>