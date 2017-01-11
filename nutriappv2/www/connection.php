<?php
function connection(){
  $conn  = include("database.php");
  return $conn;    
}