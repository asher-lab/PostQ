<?php

$use_mail_registration = false; //remeber to configure mail() function in php if you change to true!!!
$expiration_time = 2*60*60; //time in seconds

$mail_subject = 'Verification code'; // Give the email a subject 
$mail_message = '
 
Thanks for signing up!
Your account has been created, you can login after activating it using url below.
 
Please click this link to activate your account:
https://deleterium.info/chat/verify.php?code=<registration_code/>
 
'; // Message above including the link. All occurrences of <registration_code/> will be replace to random code

$mail_headers = 'From:webadmin@deleterium.info' . "\r\n"; // Set from headers

?>
