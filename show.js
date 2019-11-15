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
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('#friendRequests').hide();
  $("#alertMessages").hide();
  $('#alertNewFriend').empty();
  $('.msgtitle').text('Add new friend');
  $('#addnewfriend').show();
  markSelected("menuAddnewfriend");
}

function showFriendRequests() {
  clearTimeout(messageUpdateTimer);
  $('#messagesouter').hide();
  $('#addnewfriend').hide();
  $("#alertMessages").hide();
  $('.msgtitle').text('Manage friend requests');
  $('#alertFriendRequests').empty();
  $('#friendRequests').show();
  markSelected("menuFriendRequests");
  handleFriendRequests();
}

var current_friend_id;
var current_friend_username;
var msgSymKey;
var messageUpdateTimer;
var messageTimeout = 5; //in second
var msgId;
const warnSymkeyExchangeEvery = 20 //messages

function showMessages(friend_username, friend_id, symkey) {
  clearTimeout(messageUpdateTimer); //otherwise problem with switching between chats

  if (current_friend_id != friend_id) {
    $("#alertMessages").hide();
    current_friend_id = friend_id;
    current_friend_username = friend_username;
  }
  msgId = 0;
  var msgIduser2 = 0;

  //decrypt symmetric key
  msgSymKey = AESdecryptCBC_arr(symkey, decryptionkey);
 
  $.post("getMessages.php", { username: inputEmail, password: authenticationkey, user2Id: current_friend_id },

  function(data, status){
    var newdiv;
    $('#messages').empty(); //clear previous messages
    var messages = data.split("\n");
    for(var i=0; i<messages.length; i++) {
      if(messages[i] != "") {
        var fromTo = messages[i].substring(0,1);
        var msgNonce = messages[i].substring(1, messages[i].indexOf(";"));
        var idAndMsg = messages[i].substring(messages[i].indexOf(";")+1);
        var decIdAndMsg = AESdecryptCTR(idAndMsg, msgSymKey, msgNonce);
        if(decIdAndMsg.indexOf(";") == -1) //error decoding or outdated symkey
          continue;
        var msgIdi = parseInt(decIdAndMsg.substring(0, decIdAndMsg.indexOf(";")));
        var msg = decIdAndMsg.substring(decIdAndMsg.indexOf(";")+1);
        if(msgIdi == 00 && decIdAndMsg.indexOf(";") != 1) //error decoding or outdated symkey
          continue;
        if(fromTo == '1' && msgIdi > msgId) {
          msgId = msgIdi;
          newdiv = $('<div class="msgFromMe"></div>');
          newdiv.text(msg);
          $('#messages').append(newdiv);
        } else if(fromTo == '0' && msgIdi > msgIduser2){
          msgIduser2 = msgIdi;
          newdiv = $('<div class="msgToMe"></div>');
          newdiv.text(msg);
          $('#messages').append(newdiv);
        }
        if(i != 0 && i % warnSymkeyExchangeEvery == 0)
          $('#messages').append('<div>Reminder: Consider to change secret code.</div>');
      }
    }

    $('#addnewfriend').hide();
    $('#friendRequests').hide();
    $('.msgtitle').text(current_friend_username);
    $('#messagesouter').show();
    $('#messages').scrollTo("max");
    messageUpdateTimer = setTimeout(function(){showMessages(current_friend_username, current_friend_id, symkey);}, messageTimeout*1000);
    for (var i=0 ; i < friends.length; i++) {
	  if(friends[i][1]==current_friend_id) {
        markSelected('menuMsgs_'+i.toString());
        break;
      }
    }
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
              send('I changed secret code. All my previous messages were discarded. Please accept a new generated new secret in "Friend requests" to continue conversation. If you send further messages they can not be read by me.');
              displayAlert("#alertMessages","success","Symmetric key changed successfully!");
              showMessages(current_friend_username, current_friend_id, symkeyforme);
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
