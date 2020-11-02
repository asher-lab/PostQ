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

var friends;

function generateMenu(active_item) {
  clearTimeout(menuUpdateTimer);
  if(active_item === undefined)
    current_selected_menu = $("#menu li.active").attr('id');
  else
    current_selected_menu = active_item;
  //get friends - name,userId,symkey
  $.post("getFriendList.php", {username: inputEmail, password: authenticationkey},
  function(data, status){
    var new_a, new_li, new_msg;
    //empty the menu
    $('#menu').empty();
    //add AddFriend button to the top
    $('#menu').append('<li id="menuAddnewfriend"><a href="#"><span class="glyphicon glyphicon-plus"></span> New friend</a></li>');
    $('#menuAddnewfriend').on('click', showAddNewFriend);
    if(pending_requests[1] > 0)
      $('#menu').append('<li id="menuFriendRequests"><a href="#"><span class="glyphicon glyphicon-edit"></span> Friend requests (' + pending_requests[1] + ')</a></li>');
    else
      $('#menu').append('<li id="menuFriendRequests"><a href="#"><span class="glyphicon glyphicon-edit"></span> Friend requests</a></li>');
    $('#menuFriendRequests').on('mousedown', showFriendRequests);
    friends = $.csv.toArrays(data);
    new_msg = 0;
    for(var i = 0; i < friends.length; i++) {
      new_a=$('<a href="#"></a>');
      if(friends[i][3] == 0) {
        new_a.text(friends[i][0]);
      } else {
        new_a.text(friends[i][0] + " (" + friends[i][3] + ")");
        new_msg += parseInt(friends[i][3]);
      }
      new_a.prepend('<span class="glyphicon glyphicon-user"></span> ');
      new_li=$('<li id="menuMsgs_' + i.toString() + '"></li>');
      $('#menu').append(new_li.append(new_a));
      $('#menuMsgs_' + i.toString()).on('click', menuMsgs_event);
    }
    $('#menu').append('<li id="menuSignout"><a href="#"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>');
    $('#menuSignout').on('click', signout);
    markSelected(current_selected_menu);
    pending_requests[0] = new_msg;
    new_msg += pending_requests[1];
    if(new_msg) {
      document.title = '(' + new_msg + ') ' + page_title;
    } else {
      document.title = page_title;
    }
    menuUpdateTimer = setTimeout(generateMenu, menuTimeout*1000);
    setTimeout(updateMenuFriendRequests, 100);
  });
}

function menuMsgs_event(event){
  var item = event.currentTarget.id.split('_');
  var i = parseInt(item[1]);
  showMessages(friends[i][0],friends[i][1], friends[i][2] );
}

function updateMenuFriendRequests(){
  $.post("countRequests.php", {username: inputEmail, password: authenticationkey},
  function(data, status){
    //alert(data);
    var i = parseInt(data);
    if(i != pending_requests[1]) {
      pending_requests[1] = i;
      $('#menuFriendRequests').html('<a href="#"><span class="glyphicon glyphicon-edit"></span> Friend requests (' + i + ')</a>');
    if(pending_requests[0]+pending_requests[1])
      document.title = '(' + (pending_requests[0]+pending_requests[1]) + ') ' + page_title;
    else
      document.title = page_title;
    }
  });
}
