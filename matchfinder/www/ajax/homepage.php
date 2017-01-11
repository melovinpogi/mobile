<?php
include('../connect/db.php');

function time_passed($timestamp){
    //type cast, current time, difference in timestamps
    $timestamp      = (int) $timestamp;
    $current_time   = time();
    $diff           = $current_time - $timestamp;
    
    //intervals in seconds
    $intervals      = array (
        'year' => 31556926, 'month' => 2629744, 'week' => 604800, 'day' => 86400, 'hour' => 3600, 'minute'=> 60
    );
    
    //now we just find the difference
    if ($diff == 0)
    {
        return 'Just now';
    }    

    if ($diff < 60)
    {
        return $diff == 1 ? $diff . ' second ago' : $diff . ' seconds ago';
    }        

    if ($diff >= 60 && $diff < $intervals['hour'])
    {
        $diff = floor($diff/$intervals['minute']);
        return $diff == 1 ? $diff . ' minute ago' : $diff . ' minutes ago';
    }        

    if ($diff >= $intervals['hour'] && $diff < $intervals['day'])
    {
        $diff = floor($diff/$intervals['hour']);
        return $diff == 1 ? $diff . ' hour ago' : $diff . ' hours ago';
    }    

    if ($diff >= $intervals['day'] && $diff < $intervals['week'])
    {
        $diff = floor($diff/$intervals['day']);
        return $diff == 1 ? $diff . ' day ago' : $diff . ' days ago';
    }    

    if ($diff >= $intervals['week'] && $diff < $intervals['month'])
    {
        $diff = floor($diff/$intervals['week']);
        return $diff == 1 ? $diff . ' week ago' : $diff . ' weeks ago';
    }    

    if ($diff >= $intervals['month'] && $diff < $intervals['year'])
    {
        $diff = floor($diff/$intervals['month']);
        return $diff == 1 ? $diff . ' month ago' : $diff . ' months ago';
    }    

    if ($diff >= $intervals['year'])
    {
        $diff = floor($diff/$intervals['year']);
        return $diff == 1 ? $diff . ' year ago' : $diff . ' years ago';
    }
}

$sql = mysql_query("select concat(u.firstname,' ', u.lastname) as user_id,time_posted, status,likes,unlikes,u.photo as users_photo,up.id 
                    from users_post up
                    left join users u on u.id = up.user_id
                    order by up.id desc");


if($sql === FALSE) {
    die("Error, Cannot connect to the database."); // TODO: better error handling
}
   
       while($query = mysql_fetch_array($sql)){
        $user_id     = $query[0];
        $time_posted = $query[1];
        $status      = $query[2];
        $likes       = $query[3];
        $unlikes     = $query[4];
        $photo       = $query[5];
        $users_postid = $query[6];

        $month =date("m",strtotime($time_posted));
        $day = date("d",strtotime($time_posted));
        $year = date("y",strtotime($time_posted));
        $newdate = strtotime($time_posted);
        $timestamp = mktime(date('H', $newdate),date('i', $newdate),date('s', $newdate),$month,$day,$year);
        

        echo '<img src="data:image/jpeg;base64,' . base64_encode( $photo ) . '" alt="" class="img-circle img-responsive img-adjustment">
                 <span><a href="#">'.$user_id.'</a></span>
                    <h5 style="margin:auto;"><small>'.time_passed($timestamp).'</small></h5>
                        <div class="caption">
                            <h4 class="h4-adjustment"><small>'.$status.'</small></h4>
                                <div class="row">
                                    <div class="col-xs-12 col-sm-12 a-adjustment">
                                        <a href="#">'.$likes.' Likes</a> - <a href="#">30 Comments</a>
                                    </div>
                                </div>

                            <div class="row">
                                <div class="col-xs-12 col-sm-12 text-center">
                                     <div class="btn-group">
                                        <button class="like btn btn-default" type="button" id="like-'.$users_postid.'" value="'.$users_postid.'"><i class="fa fa-check-square-o"></i> Like</button>
                                        <button class="unlike btn btn-default" type="button"  id="unlike-'.$users_postid.'" value="'.$users_postid.'"><i class="fa fa-times"></i> Unlike</button>
                                       <button class="comment btn btn-default" type="button" id="comment-'.$users_postid.'" value="'.$users_postid.'"><i class="fa fa-comment-o"></i> Comment</button>
                                    </div>
                                </div>
                            </div>
                        </div>';
         }

?>