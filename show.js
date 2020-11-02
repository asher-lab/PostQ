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

function showAddNewFriend() {
  current_friend_id = -1
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('#friendRequests').hide();
  $("#alertMessages").hide();
  $('#alertNewFriend').empty();
  $('#messagetitle').html('<h2>Add new friend</h2>');
  $('#menubrand').html('Add new friend');
  $('#addnewfriend').show();
  markSelected("menuAddnewfriend");
}

function showFriendRequests() {
  current_friend_id = -1
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('#addnewfriend').hide();
  $("#alertMessages").hide();
  $('#messagetitle').html('<h2>Manage friend requests</h2>');
  $('#menubrand').html('Friend requests');
  $('#alertFriendRequests').empty();
  $('#friendRequests').show();
  markSelected("menuFriendRequests");
  handleFriendRequests();
}

var current_friend_id = -1;
var current_friend_username;
var msgSymKey;
var messageUpdateTimer;
var messageTimeout = 5; //in second
var menuUpdateTimer;
var menuTimeout = 6; //in second
var current_selected_menu;
var pending_requests = [ 0, 0 ];
var msgId;
const warnSymkeyExchangeEvery = 20 //messages
const page_title = 'PostQ';

function showMessages(friend_username, friend_id, symkey) {
  clearTimeout(messageUpdateTimer); //otherwise problem with switching between chats

  if (current_friend_id != friend_id) {
    $('#addnewfriend').hide();
    $('#friendRequests').hide();
    $("#alertMessages").hide();
    current_friend_id = friend_id;
    current_friend_username = friend_username;
    var newdiv=$('<h2></h2>');
    newdiv.text(current_friend_username);
    newdiv.append('<a href="#" id="a_symkey"><span class="glyphicon glyphicon-flash" title="Delete all messages you sent and request a new secret code for conversation"></span></a>');
    $('#messagetitle').html(newdiv);
    $('#menubrand').text(current_friend_username);
    $('#menubrand').append('<a href="#" id="a_symkey2"><span class="glyphicon glyphicon-flash" title="Delete all messages you sent and request a new secret code for conversation"></span></a>');
    $('#a_symkey').on('click', changeSymkey);
    $('#a_symkey2').on('click', changeSymkey);
    $('#messages').empty();
    $('#messages').append("<div>Loading messages...</div>"); //
    for (var i=0 ; i < friends.length; i++) {
      if(friends[i][1]==current_friend_id) {
        markSelected('menuMsgs_'+i.toString());
        break;
      }
    }
    $('#messagesouter').show();
  }
  msgId = 0;

  //decrypt symmetric key
  if (symkey !== undefined)
    msgSymKey = AESdecryptCBC_arr(symkey, decryptionkey);
 
  $.post("getMessages.php", { username: inputEmail, password: authenticationkey, user2Id: current_friend_id },

  function(data, status){
    var newdiv, error_decode;
    $('#messages').empty(); //clear previous messages
    var messages = data.split("\n");
    for(var i=0; i<messages.length; i++) {
      if(messages[i] != "") {
        error_decode = false;
        var fromTo = messages[i].substring(0,1);
        var msgNonce = messages[i].substring(1, messages[i].indexOf(";"));
        var idAndMsg = messages[i].substring(messages[i].indexOf(";")+1);
        var decIdAndMsg = AESdecryptCTR(idAndMsg, msgSymKey, msgNonce);
        if(decIdAndMsg.indexOf(";") == -1) // Error decoding or outdated symkey
          error_decode = true;
        else {
          var msgIdi = parseInt(decIdAndMsg.substring(0, decIdAndMsg.indexOf(";")));
          if(isNaN(msgIdi)) // Error decoding or outdated symkey
            error_decode = true;
          else
            var msg = decIdAndMsg.substring(decIdAndMsg.indexOf(";")+1);
        }
        if(fromTo == '1') {
          newdiv = $('<div class="msgFromMe"></div>');
          if(error_decode)
            newdiv.text(idAndMsg);
          else {
            msgId = msgIdi;
            newdiv.text(msg);
          }
          $('#messages').append(newdiv);
        } else if(fromTo == '0'){
          newdiv = $('<div class="msgToMe"></div>');
          if(error_decode)
            newdiv.text(idAndMsg);
          else
            newdiv.text(msg);
          $('#messages').append(newdiv);
        }
        if(i != 0 && i % warnSymkeyExchangeEvery == 0)
          $('#messages').append('<div>Reminder: Consider to change secret code.</div>');
      }
    }

    $('#messages').scrollTo("max");
    messageUpdateTimer = setTimeout(function(){showMessages(current_friend_username, current_friend_id);}, messageTimeout*1000);
  });
}

function changeSymkey() {
  $.post("getPublicKey.php", { user: current_friend_username },
    function(data, status){
      if(data.startsWith("Error")) {
        displayAlert("#alertMessages","danger","Change symkey failed. " + data);
      } else { //no error
        var publicKeyOfFriend = data;
        var encaps = NTRUEncapsulate(publicKeyOfFriend);
        var plainkey = encaps[0];
        var symkeyforfriend = encaps[1];
        var symkeyforme = AESencryptCBC_arr(plainkey, decryptionkey);

        $.post("initChangeSymkey.php", {username: inputEmail, password: authenticationkey, friend: current_friend_username, symkeyforme: symkeyforme, symkeyforfriend: symkeyforfriend},
          function(data, status){
            if(data == "1") { //success
              send(inputEmail+' changed secret code. All his/her previous messages were discarded. Please accept a new generated new secret in "Friend requests" to continue conversation. If you send further messages they will not be read.');
              setTimeout(function() { displayAlert("#alertMessages","success","Symmetric key changed successfully!"); }, 500);
              setTimeout(function() {   $("#alertMessages").hide();  $("#alertMessages").empty() }, 5000);
              clearTimeout(messageUpdateTimer); //
              setTimeout(showMessages(current_friend_username, current_friend_id, symkeyforme), 5100);
              generateMenu();
            } else {
              displayAlert("#alertMessages","danger",data);
            }
          }
        );
      }
    }
  );
}

function markSelected(id) {
  $("li").removeClass("active");
  $("#"+id).addClass("active");
}

//solve the navbar remaining open on mobile after click https://github.com/twbs/bootstrap/issues/12852#issuecomment-39746001
$(document).on('click','.navbar-collapse.in',function(e) {
    if( $(e.target).is('a') ) {
        $(this).collapse('hide');
    }
});
