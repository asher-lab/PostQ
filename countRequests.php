<?php
 
//Usage: countRequests.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
// Expected return: total number of friend requests and symkey exchange requests;
require_once("helpers.php");
require_once("sqlconnect.php");
if(!$_POST['username'] || !$_POST['password'])
  die("Error - one of the parameters is not set.");

//check password
if(!(substr(loginhelper($conn, $_POST['username'], $_POST['password']),0,1) === "1")) //loginhelper() needs to return with 1... for successfull login
  die("Authentication failed");
  
//get user ID
$userId = getUserId($conn, $_POST['username']);
if (!is_numeric($userId))
  die($userId);

// prepare, bind and execute
$stmt = $conn->prepare("SELECT COUNT(*) FROM (SELECT symkeyrequests.id FROM symkeyrequests WHERE symkeyrequests.useridTO = ? UNION SELECT friendrequests.id FROM friendrequests WHERE friendrequests.useridTO = ? AND friendrequests.rejected = 0 ) AS myjoin");

$stmt->bind_param("ii", $userId, $userId);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($result);
$stmt->fetch();

echo($result);

?>
