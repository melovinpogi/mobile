<?php
    include("connection.php");

    // We don't need action for this tutorial, but in a complex code you need a way to determine Ajax action nature
    //$action = $_POST['action'];
     
    // Decode parameters into readable PHP object
    parse_str($_POST['formData'], $output);
  
    // Get username and password
    $firstname  = $output['firstname'];
    $lastname   = $output['lastname'];
    $middlename = $output['middlename'];
    $email      = $output['email'];
    $phone      = $output['phone'];
    $username   = $output['rusername'];
    $password   = $output['rpassword'];
    $code       = $output['distributor_code'];
    $status     = true;


    $query = "select count(*) as count from user where username = '".$username."' ";

    $result = mysqli_query(connection(),$query);
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        if($row["count"] > 0){
             $status = false;
        }
       
      }
    }
    
    if(!$status){
        $output = array('status' => $status,'username' => $query,'password' => $password,'firstname' => $firstname,'middlename' => $middlename,
            'lastname' => $lastname,'email' => $email,'phone' => $phone,'distributor_code' => $phone);
        echo json_encode($output);
    }
    else{
        $query = "insert into user(username,password,firstname,lastname,middlename,phone_number,email_address,user_type_id,distributor_code)
                  select '".$username."','".$password."','".$firstname."','".$lastname."','".$middlename."','".$phone."','".$email."',0
                  ,'".$code."' ";

        $result = mysqli_query(connection(),$query);
        if(!$result){
            $status = false;
             $output = array('status' => $status,'username' => $query,'password' => $password,'firstname' => $firstname,'middlename' => $middlename,
            'lastname' => $lastname,'email' => $email,'phone' => $phone,'distributor_code' => $phone);
            echo json_encode($output);
        }
        else{
             $output = array('status' => $status,'username' => $query,'password' => $password,'firstname' => $firstname,'middlename' => $middlename,
            'lastname' => $lastname,'email' => $email,'phone' => $phone,'distributor_code' => $phone);
            echo json_encode($output);
        }
    }
?>