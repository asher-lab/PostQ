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

$(window).load(pageLoaded);

function pageLoaded() {
  //Check for localStorage and login user
  if (localStorage.getItem("local_username") !== null) {
	  signin_from_localStorage();
  }
  $('#btn_signin').on( "click", signin);
  $('#btn_register').on('click', register);
  $('#btn_addFriend').on('click', addFriend);
  $('#newmsg').on('keydown'  , process_send_event );
  $('#inputPassword').on('keyup'  , function (event) { if(event.keyCode == 13) signin(); } );
  $('#inputFriendEmail').on('keyup'  , function (event) { if(event.keyCode == 13) addFriend(); } );
  document.addEventListener("visibilitychange", onVisibilityChanged, false);
  document.addEventListener("mozvisibilitychange", onVisibilityChanged, false);
  document.addEventListener("webkitvisibilitychange", onVisibilityChanged, false);
  document.addEventListener("msvisibilitychange", onVisibilityChanged, false);
  showAddNewFriend();
}

function send(text) {
  msgId++;
  var msg = $('#newmsg').val();
  $('#newmsg').val(''); //cleare the message box
  if(typeof text === 'string')
    msg=text;
  msg = msg.trim(); //remove trailing new line
  if(msg=="")
    return;
  var msgWithId = msgId.toString() + ";" + msg;
  var nonce = secureRandom(8);
  var encMsg = AESencryptCTR(msgWithId,msgSymKey,nonce);
  var hexNonce = ByteArray_2_HexString(nonce);
  $.post("sendMsg.php", { username: inputEmail, password: authenticationkey,  user2Id: current_friend_id, msg: encMsg, nonce: hexNonce},
  function(data, status){
    if(data == 1) { //if success, display message
      $("#alertMessages").hide(); //hide the alert
      var new_div = $('<div class="msgFromMe_noRefresh"></div>');
      new_div.text(msg);
      $('#messages').append(new_div);
      $('#messages').scrollTo("max",500);
    } else {
      displayAlert("#alertMessages","danger","Sending message failed. " + data);
    }
  });
}

function process_send_event(event) {
  if(event.keyCode == 13) {
    if(event.ctrlKey == false){
      send();
      event.preventDefault();
    }
    else
      $('#newmsg').val($('#newmsg').val()+"\n");
  }
}

// Stop messageTimer, so number of unread messages will increase when page is not visible.
// User will be warned, because the menuTimer will still be active
function onVisibilityChanged() {
  if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden) {
    // The tab has lost focus
    if (current_friend_id != -1 )
      clearTimeout(messageUpdateTimer);
  } else {
    // The tab has gained focus
    if (current_friend_id != -1 )
      messageUpdateTimer = setTimeout(function(){showMessages(current_friend_username, current_friend_id);}, 100);
  }
}
