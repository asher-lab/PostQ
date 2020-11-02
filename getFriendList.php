<?php
/*
 * Anna Dorottya Simon, Márk Szabó
 * Neptun-ID: R48G73, EMX74N
 * Applied cryptography project - a postquantum messenger application
 * January 2017
 * This solution was submitted and prepared by Anna Dorottya Simon(R48G73), Márk Szabó(EMX74N) for the project assignment of the Applied cryptography project seminar course.
 * We declare that this solution is our own work.
 * We have put the necessary references wherever we have used bigger and/or complicated external codes in our project. For shorter code snippets (usually from Stack Overflow) we have put the reference there in most cases.
 * Given the uniqueness of the project (no other student had, have or will have the same project) we have published our code on GitHub with the permission of our professors.
 * Students’ regulation of Eötvös Loránd University (ELTE Regulations Vol. II. 74/C. § ) states that as long as a student presents another student’s work - or at least the significant part of it - as his/her own performance, it will count as a disciplinary fault. The most serious consequence of a disciplinary fault can be dismissal of the student from the University.
 */
 
//Usage: getFriendList.php?username=email@adfs.hu&password=iExmLmGEgXVDPfGjI%2Fk5Iw%3D%3D
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
$stmt = $conn->prepare("SELECT users.username, symkeys.user2, symkeys.symkey, t1.mysum from users, symkeys LEFT JOIN ( SELECT messages.user1 AS myuser, SUM(messages.new_msg) AS mysum FROM messages WHERE messages.user2 = ? GROUP BY myuser ) t1 ON t1.myuser = symkeys.user2 WHERE symkeys.user2 = users.id AND symkeys.user1 = ? ORDER BY users.username ASC");
$stmt->bind_param("ii", $userId, $userId);
$stmt->execute();
if ($stmt->errno)
  die("Error during the execution of the SQL query");

//get the result
$stmt->bind_result($row[0], $row[1], $row[2], $row[3]); //$username, $userId, $symkey, $new_msg

$f = fopen('php://output', 'w');
while($stmt->fetch()) {
  fputcsv($f, $row, ',', '"'); //$username, $userId, $symkey, $new_msg
}

?>
