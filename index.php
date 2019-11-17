<?php

header("Content-Security-Policy: default-src 'self' ; style-src 'self' https://maxcdn.bootstrapcdn.com ; font-src https://maxcdn.bootstrapcdn.com ; child-src 'self'; object-src 'none' ; form-action 'none' ; frame-ancestors 'none' ;");

?>
<!DOCTYPE html>
<html lang="hu">
<head>
<!--
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
-->
  <title>PostQ</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <link rel="stylesheet" href="style.css">
  <!-- Basic external JS -->
  <script src="external/jquery(1.12.4).min.js"></script>
  <script src="external/bootstrap(3.3.6).min.js"></script>
  <!-- Additional external JS -->
  <script src="external/jquery.scrollTo(2.1.0).min.js"></script>
  <script src="external/scrypt.js" type="text/javascript"></script>
    <!-- Dependencies of scrypt-->
  <script src="external/setImmediate.js" type="text/javascript"></script>
  <script src="external/buffer.js" type="text/javascript"></script>
  <script src="external/unorm.js" type="text/javascript"></script>
  <script src="external/aes.js" type="text/javascript"></script>
  <script src="external/secure-random.js" type="text/javascript"></script>
  <script src="external/jquery.csv.min.js" type="text/javascript"></script>
  <script src="external/sha512.min.js" type="text/javascript"></script>
  <script src="polynomial.js" type="text/javascript"></script>
  <!-- Custom JS -->
  <script src="postq.js" type="text/javascript"></script>
  <script src="ntru.js" type="text/javascript"></script>
  <script src="signin.js" type="text/javascript"></script>
  <script src="aes.js" type="text/javascript"></script>
  <script src="addFriend.js" type="text/javascript"></script>
  <script src="handleFriendRequests.js" type="text/javascript"></script>
  <script src="getFriendList.js" type="text/javascript"></script>
  <script src="show.js" type="text/javascript"></script>

</head>
<body>
 <div id="signin" class="container">
  <div class="form-signin">
    <h2 class="form-signin-heading">Sign in or register</h2>
    <div id="loginalert"></div>
    <label for="inputEmail" class="sr-only">Username</label>
    <input type="text" id="inputEmail" class="form-control" placeholder="Username" required autofocus value="">
    <label for="inputPassword" class="sr-only">Password</label>
    <input type="password" id="inputPassword" class="form-control" placeholder="Password" required value="" >
    <div class="checkbox">
      <label>
        <input type="checkbox" value="remember-me" id="rememberMe"> Remember me
           <span class="glyphicon glyphicon-question-sign" title="Session data will be kept in your browser local storage. Use only if you trust all users of your computer!"></span>
      </label>
    </div>
    <button class="btn btn-lg btn-success btn-block" id="btn_signin">Sign in</button>
    <button class="btn btn-lg btn-warning btn-block" id="btn_register">Register</button>
     <div class="progress">
      <div id="scryptprogress" class="progress-bar progress-bar-striped active" role="progressbar"
      aria-valuenow="0" aria-valuemin="0" aria-valuemax="1">
      </div>
    </div>
  </div>
 </div> <!-- /container -->


 <div id="main">
  <div class="height100">
    <div class="col-sm-3" id="nav_1">
      <div class="" id="nav_11">
        <nav class="navbar navbar-default navbar-absolute" role="navigation" id="nav_111">
          <div class="container-fluid" id="menuheader">
            <div class="navbar-header width100">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <span class="navbar-brand msgtitle" id="menubrand">PostQ</span>
            </div>
            <div id="navbar" class="navbar-collapse collapse">

              <ul class="nav navbar-nav width100" id="menu">

              </ul>
            </div><!--/.nav-collapse -->
          </div><!--/.container-fluid -->
        </nav>
      </div>
    </div>
    <div class="col-sm-9" id="messageouterouter">
      <div class="msgtitle width100" id="messagetitle"></div>
      <div class="container-fluid" id="addnewfriend">
        <br>
        <div id="alertNewFriend"></div>
        <label for="inputFriendEmail" class="sr-only">Friend's username</label>
        <input type="email" id="inputFriendEmail" class="form-control" placeholder="Friend's username" required value="">
        <button class="btn btn-lg btn-success btn-block" id="btn_addFriend">Add friend</button>
      </div> <!-- addnewfriend -->
      <div class="container-fluid" id="friendRequests">
        <br>
        <div id="alertFriendRequests" class="alertNewFriend"></div>
        <div id="symkeyrequestsouter"></div>
        <div id="friendrequestsouter"></div>
      </div> <!-- friendRequests -->

      <div class="container-fluid height100" id="messagesouter">
        <div id="alertMessages"></div>
        <div id="messages">

        </div>
        <div id="textarea">
          <textarea class="form-control" id="newmsg" rows="4"></textarea>
        </div>

      </div> <!-- container-fluid -->

    </div> <!-- .col-sm-10 -->
  </div> <!-- .row -->
 </div> <!-- #main -->

  <footer class="container-fluid text-center">
     Copyright <span class="glyphicon glyphicon-copyright-mark"></span> PostQ
  </footer>
</body>
</html>
